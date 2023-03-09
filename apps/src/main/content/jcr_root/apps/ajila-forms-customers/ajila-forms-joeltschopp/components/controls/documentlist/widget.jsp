<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<%@include file="/libs/foundation/global.jsp" %>

<div class="documentlist" style="">
    <ul class="">
        <%
            GuideRadioButton guideRadioButton = ((GuideRadioButton) request.getAttribute("guideField"));
            Map<String, String> options = guideRadioButton.getOptions();

            for (Map.Entry<String, String> entry : options.entrySet()) {
                String[] splitKey = entry.getKey().split("\\|");
                String href = splitKey[0];
                String filename = splitKey[1];
        %>
        <c:set var="title" value="<%=entry.getValue()%>"/>
        <c:set var="href" value="<%=href%>"/>
        <c:set var="filename" value="<%=filename%>"/>

        <li class="documentItem">
            <div class="<%= GuideConstants.GUIDE_FIELD_WIDGET%> guideRadioButtonItem" style="cursor: pointer;" role="link" data-url="${guide:encodeForHtml(href,xssAPI)}">
                <span class="documentTitle" style="font-weight: bold;">${guide:encodeForHtml(title,xssAPI)}</span>
                <span class="documentName">${guide:encodeForHtml(filename,xssAPI)}</span>
            </div>
        </li>
        <% }%>
    </ul>
</div>