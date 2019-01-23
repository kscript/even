{% if theme.valine.appid and theme.valine.appkey %}
<!-- valine Comments -->
{% if theme.leancloud.app_id.length === 0 %}
<script src="//kscript.github.io/public/js/av-min.js"></script>
{% endif %}
<script src="//kscript.github.io/public/js/Valine.min.js"></script>
<script type="text/javascript">
setTimeout(function() {
    var vcomments = document.getElementById("vcomments");
    vcomments && Valine && new Valine({
        el: '#vcomments',
        notify: {{ theme.valine.notify }},
        verify: {{ theme.valine.verify }},
        app_id: "{{ theme.valine.appid }}",
        app_key: "{{ theme.valine.appkey }}",
        placeholder: "{{ theme.valine.placeholder }}",
        avatar: '{{ theme.valine.avatar }}',
        lang: 'zh-cn'
    });
})
</script>
{% endif %}
