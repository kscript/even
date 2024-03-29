(function (window) {
  'use strict';

  function Even(config) {
    this.config = config;
  }

  Even.prototype.setup = function () {
    var leancloud = this.config.leancloud;

    this.navbar();
    if (this.config.toc) {
      this.scrollToc();
      this.tocFollow();
    }
    if (this.config.fancybox) {
      this.fancybox();
    }
    if (leancloud.app_id && leancloud.app_key) {
      this.recordReadings();
    }
    if (this.config.pjax) {
      this.pjax();
    }
    this.backToTop();

    this.search();
  };

  Even.prototype.navbar = function () {
    var $nav = $('#mobile-navbar');
    var $navIcon = $('.mobile-navbar-icon');

    var slideout = new Slideout({
      'panel': document.getElementById('mobile-panel'),
      'menu': document.getElementById('mobile-menu'),
      'padding': 180,
      'tolerance': 70
    });
    slideout.disableTouch();

    $navIcon.click(function () {
      slideout.toggle();
    });

    slideout.on('beforeopen', function () {
      $nav.addClass('fixed-open');
      $navIcon.addClass('icon-click').removeClass('icon-out');
    });

    slideout.on('beforeclose', function () {
      $nav.removeClass('fixed-open');
      $navIcon.addClass('icon-out').removeClass('icon-click');
    });

    $('#mobile-panel').on('touchend', function () {
      slideout.isOpen() && $navIcon.click();
    });
  };

  Even.prototype.scrollToc = function () {
    var SPACING = 20;
    var $toc = $('.post-toc');
    var $footer = $('.post-footer');

    if ($toc.length) {
      var minScrollTop = $toc.offset().top - SPACING;
      var maxScrollTop = $footer.offset().top - $toc.height() - SPACING;

      var tocState = {
        start: {
          'position': 'absolute',
          'top': minScrollTop
        },
        process: {
          'position': 'fixed',
          'top': SPACING
        },
        end: {
          'position': 'absolute',
          'top': maxScrollTop
        }
      }

      $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();

        if (scrollTop < minScrollTop) {
          $toc.css(tocState.start);
        } else if (scrollTop > maxScrollTop) {
          $toc.css(tocState.end);
        } else {
          $toc.css(tocState.process);
        }
      })
    }
  };

  Even.prototype.tocFollow = function () {
    var HEADERFIX = 30;
    var $toclink = $('.toc-link'),
      $headerlink = $('.headerlink');

    var headerlinkTop = $.map($headerlink, function (link) {
      return $(link).offset().top;
    });

    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();

      for (var i = 0; i < $toclink.length; i++) {
        var isLastOne = i + 1 === $toclink.length,
          currentTop = headerlinkTop[i] - HEADERFIX,
          nextTop = isLastOne ? Infinity : headerlinkTop[i + 1] - HEADERFIX;

        if (currentTop < scrollTop && scrollTop <= nextTop) {
          $($toclink[i]).addClass('active');
        } else {
          $($toclink[i]).removeClass('active');
        }
      }
    });
  };

  Even.prototype.fancybox = function () {
    if ($.fancybox) {
      $('.post').each(function () {
        $(this).find('img').each(function () {
          var href = 'href="' + this.src + '"';
          var title = 'title="' + this.alt + '"';
          $(this).wrap('<a class="fancybox" ' + href + ' ' + title + '></a>');
        });
      });

      $('.fancybox').fancybox({
        openEffect: 'elastic',
        closeEffect: 'elastic'
      });
    }
  };

  Even.prototype.recordReadings = function () {
    if (typeof AV !== 'object') return;

    var $visits = $('.post-visits');
    var Counter = AV.Object.extend('Counter');
    if ($visits.length === 1) {
      addCounter(Counter);
    } else {
      showTime(Counter);
    }

    function updateVisits(dom, time) {
      var readText = dom.text().replace(/(\d+)/i, time)
      dom.text(readText);
    }

    function addCounter(Counter) {
      var query = new AV.Query(Counter);

      var url = $visits.data('url').trim();
      var title = $visits.data('title').trim();

      query.equalTo('url', url);
      query.find().then(function (results) {
        if (results.length > 0) {
          var counter = results[0];
          counter.save(null, {
            fetchWhenSave: true
          }).then(function (counter) {
            counter.increment('time', 1);
            return counter.save();
          }).then(function (counter) {
            updateVisits($visits, counter.get('time'));
          });
        } else {
          var newcounter = new Counter();
          newcounter.set('title', title);
          newcounter.set('url', url);
          newcounter.set('time', 1);

          newcounter.save().then(function () {
            updateVisits($visits, newcounter.get('time'));
          });
        }
      }, function (error) {
        // eslint-disable-next-line
        console.log('Error:' + error.code + " " + error.message);
      });
    }

    function showTime(Counter) {
      $visits.each(function () {
        var $this = $(this);
        var query = new AV.Query(Counter);
        var url = $this.data('url').trim();

        query.equalTo('url', url);
        query.find().then(function (results) {
          if (results.length === 0) {
            updateVisits($this, 0);
          } else {
            var counter = results[0];
            updateVisits($this, counter.get('time'));
          }
        }, function (error) {
          // eslint-disable-next-line
          console.log('Error:' + error.code + " " + error.message);
        });
      })
    }
  };

  Even.prototype.pjax = function () {
    if (location.hostname === 'localhost' || this.hasPjax) return;
    this.hasPjax = true;

    var that = this;
    $(document).pjax('a:not(.no-pjax)', 'body', { fragment: 'body' });
    $(document).on('pjax:send', function () {
      NProgress.start();
      $('body').addClass('hide-top');
    });
    $(document).on('pjax:complete', function () {
      NProgress.done();
      $('body').removeClass('hide-top');
      that.setup();
    });
  };

  Even.prototype.backToTop = function () {
    var $backToTop = $('#back-to-top');

    $(window).scroll(function () {
      if ($(window).scrollTop() > 100) {
        $backToTop.fadeIn(1000);
      } else {
        $backToTop.fadeOut(1000);
      }
    });

    $backToTop.click(function () {
      $('body,html').animate({ scrollTop: 0 });
    });
  };

  Even.prototype.search = function () {
    var _searchData = null,
      _contentCache = $('#content').clone(true);
    var $menuSearch = $('.menu-search'),
      $searchInput = $('#search-input');
    $('#open-search').click(function handleOpenSeach() {
      $menuSearch.addClass('expanded');
      $searchInput.focus();
      $.ajax({
        url: CONFIG.searchPath,
        dataType: 'xml',
        success: function (xmlResponse) {
          _searchData = [];
          $('entry', xmlResponse).each(function () {
            // $('description', this).length && _searchData.push({
            //   title: $('title', this).text(),
            //   content: $('content', this).text(),
            //   tags: $('tags tag', this),
            //   description: decodeURIComponent($('description', this).text()).replace(/\</g, '&lt;'),
            //   url: decodeURIComponent($('url', this).text())
            // });
            _searchData.push({
              title: $('title', this).text(),
              content: $('content', this).text(),
              tags: $('tags tag', this),
              description: decodeURIComponent($('description', this).text()).replace(/\</g, '&lt;'),
              url: decodeURIComponent($('url', this).text())
            });
          }).get();
        }
      });
    });
    $('#close-search').click(function handleCloseSeach() {
      $menuSearch.removeClass('expanded');
      $searchInput.val('');
      _contentCache && $('#content').replaceWith(_contentCache);
    });
    $searchInput.on('input', function handleSearchInput() {
      var keywords = this.value.trim();
      if (keywords.length === 0) {
        _contentCache && $('#content').replaceWith(_contentCache);
        return;
      }

      var keywordsRe = new RegExp(keywords, 'i');
      var searchResult = _searchData.filter(function (item) {
        return keywordsRe.test(item.title) || keywordsRe.test(item.content);
      });
      _generateSearchContent(searchResult);
    });
    function _generateSearchContent(searchResult) {
      var resultTemplate = $('#search-result');
      var noResultTemplate = $('#no-search-result');
      var article = resultTemplate.find('article')[0];
      var section = $('<section id="post"></section>');
      var content = $('#content').clone(true);
      section.addClass('search-result posts');
      content.html('');
      if (searchResult.length) {
        searchResult.forEach(function (post) {
          var $el = $(article.cloneNode(true));
          var tags = [];
          $el.find('header .title').text(post.title);
          $el.find('.post-link, .read-more-link').attr('href', post.url);
          $el.find('.description').text(post.description);
          $el.find('.content').text(post.description);
          post.tags.each(function () {
            var node = document.createElement('a');
            node.setAttribute('href', './tags/' + $(this).text());
            node.innerText = $(this).text();
            tags.push(node);
          })
          $el.find('.post-tags').html('').append(tags);
          section.append($el);
        });
        content.append(section);
      } else {
        content.append(noResultTemplate.children().clone(true));
      }
      $('#content').replaceWith(content);
    }
  }

  var config = window.config;
  var even = new Even(config);
  even.setup();
}(window))
