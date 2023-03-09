<%@include file="/libs/fd/af/components/guidesglobal.jsp"%>
<%@page import="com.adobe.aemds.guide.utils.GuideThemeUtils" %>
<div id="${guideField.id}_<%=GuideConstants.GUIDE_FIELD_ERROR%>" class="<%=GuideConstants.GUIDE_FIELD_ERROR%>">
    <c:if test="${isEditMode}">
        <c:if test="${guideField.errorSimulatorString != null}">
            ${guideField.errorSimulatorString}
        </c:if>
    </c:if>
</div>