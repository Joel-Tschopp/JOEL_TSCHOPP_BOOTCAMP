<%@include file="/libs/fd/af/components/guidesglobal.jsp"%>
<cq:include script="init.jsp"/>
<%
    String messageBoxType = properties.get("messageBoxType", "infobox");
%>
<c:set var="guideid" scope="request" value="${guideField.id}" />
<div
    <c:choose>
        <c:when test="${guideField.guideFieldType eq 'guideTextDraw'}">
            class="<%=GuideConstants.GUIDE_FIELD%>Node <%= messageBoxType %> ${guideField.guideFieldType} ${guide:encodeForHtmlAttr(guideField.name,xssAPI)} ${guide:encodeForHtmlAttr(guideField.cssClassName,xssAPI)} <%= GuideConstants.GUIDE_STATIC_TEXT %>"
        </c:when>
        <c:otherwise>
            class="<%=GuideConstants.GUIDE_FIELD%>Node <%= messageBoxType %> ${guideField.guideFieldType} ${guide:encodeForHtmlAttr(guideField.name,xssAPI)} ${guide:encodeForHtmlAttr(guideField.cssClassName,xssAPI)} <%= GuideConstants.GUIDE_FIELD_TEXTDRAW %>"
        </c:otherwise>
    </c:choose>
     id="${guideid}" style="${guide:encodeForHtmlAttr(guideField.styles,xssAPI)};${guide:encodeForHtmlAttr(guideField.fieldInlineStyles,xssAPI)}" data-guide-view-bind="${guideid}"
     <c:if test="${isEditMode}"> data-guide-authoringconfigjson='${guide:encodeForHtmlAttr(guideField.authoringConfigJSON,xssAPI)}' </c:if> >
    <cq:include script="content.jsp"/>
</div>