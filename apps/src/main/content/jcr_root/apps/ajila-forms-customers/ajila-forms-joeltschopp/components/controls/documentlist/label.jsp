<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<c:if test="${guideField.hideTitle eq false}">
    <div class="<%=GuideConstants.GUIDE_FIELD_LABEL%> top"
         style="${guide:encodeForHtmlAttr(guideField.captionInlineStyles,xssAPI)}"><h3 id="${guideid}_label">${guide:encodeForHtml(guideField.title,xssAPI)}</h3></div>
    <%-- above code has been written in one-line intentionally. Don't indent it as it breaks inline editing of title --%>
</c:if>