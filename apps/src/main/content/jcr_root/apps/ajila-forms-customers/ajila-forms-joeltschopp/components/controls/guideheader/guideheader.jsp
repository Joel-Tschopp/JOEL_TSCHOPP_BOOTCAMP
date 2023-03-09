<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<div class="afHeader">
    <div class="container">
        <%
            Iterator<Resource> children = resource.listChildren();
            while (children.hasNext()) {
        %>
        <sling:include resource="<%= children.next() %>" />
        <%
            }
        %>
    </div>
    <div class="containerbar"></div>
</div>