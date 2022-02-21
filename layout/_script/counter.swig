{% if theme.leancloud.app_id and theme.leancloud.app_key %}
  <script src="{{url_for('lib/av-min.js')}}"></script>
  <script id="leancloud">
    AV.init({
      appId: "{{ theme.leancloud.app_id }}",
      appKey: "{{ theme.leancloud.app_key }}"
    });
  </script>
{% endif %}

