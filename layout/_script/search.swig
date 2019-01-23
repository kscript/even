{% if theme.theme.search %}	
  <div id="search-result" style="display: none;">	
    <article class="post">	
      <header class="post-header">	
        <h1 class="post-title">	
          <a href="$url$" class="post-link">	
            <div class="title">$title$</div>
          </a>	
        </h1>	
      </header>	
      <div class="post-content">	
        <div class="excerpt">
          <div class="description">$description$</div>
        </div>
        <div class="read-more">	
          <span class="tag">
            <div class="post-tags">
              $tags$
            </div>
          </span>
          <a href="$url$" class="read-more-link">	
            {{ __('posts.readmore') }}	
          </a>	
        </div>	
      </div>	
    </article>	
  </div>	
  <div id="no-search-result" style="display: none;">	
    <div class="no-result">	
      <h2>没有找到相关文章!</h2>	
    </div>	
  </div>	
{% endif %}
