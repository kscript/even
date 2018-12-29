{% if theme.valine.appid and theme.valine.appkey %}
<!-- valine Comments -->
{% if theme.leancloud.app_id.length === 0 %}
<script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
<% endif %>
<script src="//cdn.jsdelivr.net/gh/xcss/valine@v1.1.7/dist/Valine.min.js"></script>
<script type="text/javascript">
    var vcomments = document.getElementById("vcomments");
    vcomments && new Valine({
        el: '#vcomments',
        notify: {{ theme.valine.notify }},
        verify: {{ theme.valine.verify }},
        app_id: "{{ theme.valine.appid }}",
        app_key: "{{ theme.valine.appkey }}",
        placeholder: "{{ theme.valine.placeholder }}",
        avatar: '{{ theme.valine.avatar }}'
    });
</script>
{% endif %}
