<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<div id="${guidePanel.id}_guide-item-container">
    <c:if test="${guidePanel.hasToolbar  && guidePanel.toolbarPosition == 'Top'}">
        <sling:include path="${guidePanel.toolbar.path}"/>
    </c:if>
    <c:forEach items="${guidePanel.items}" var="panelItem">
        <div id="${panelItem.id}_guide-item" role="tabpanel">
            <c:if test="${not empty panelItem.navTitle && panelItem.navTitle != ' '}">
                <h2>${guide:encodeForHtml(panelItem.navTitle,xssAPI)}</h2>
            </c:if>
            <sling:include path="${panelItem.path}" resourceType="${panelItem.resourceType}"/>
        </div>
    </c:forEach>
    <c:if test="${guidePanel.hasToolbar  && guidePanel.toolbarPosition == 'Bottom'}">
        <sling:include path="${guidePanel.toolbar.path}"/>
    </c:if>
</div>