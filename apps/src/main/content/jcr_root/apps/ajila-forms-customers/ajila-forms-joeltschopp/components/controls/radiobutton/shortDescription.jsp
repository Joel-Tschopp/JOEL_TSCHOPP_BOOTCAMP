<%@include file="/libs/fd/af/components/guidesglobal.jsp"%>
<c:if test="${not empty guideField.shortDescription}">
    <div id="${guideField.id}_<%=GuideConstants.GUIDE_FIELD_SHORT_DESCRIPTION%>" class="short-description">
            ${guideField.shortDescription}
    </div>
</c:if>