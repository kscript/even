{# Post Copyright #}
{% if theme.copyright.enable %}
  {% if page.copyright !== false %}
  <div class="post-copyright">
    <p class="copyright-item">
      <span>{{ __('copyright.author') + ': ' }}</span>
      <a href="{{ config.url + config.root }}">{{ config.author }}</a>
    </p>
    <p class="copyright-item">
      <span>{{ __('copyright.link') + ': ' }}</span>
      <a href="{{config.url + config.root + page.canonical_path}}">{{config.url + config.root + page.canonical_path}}</a>
    </p>
    <p class="copyright-item">
      <span>{{ __('copyright.license') + ': ' }}</span>
      {% set license = page.license || theme.copyright.license %}
      {{ license }}
    </p>
  </div>
  {% else %}
  <div class="post-copyright">
    <p class="copyright-item">
      <span>{{ __('copyright.author') + ': ' }}</span>
      <a href="{{ page.home || 'javascript:void(0);' }}">{{ page.author }}</a>
    </p>
    <p class="copyright-item">
      <span>{{ __('copyright.link') + ': ' }}</span>
      <a href="{{ page.url }}">{{ page.url }}</a>
    </p>
  </div>
  {% endif %}
{% endif %}
