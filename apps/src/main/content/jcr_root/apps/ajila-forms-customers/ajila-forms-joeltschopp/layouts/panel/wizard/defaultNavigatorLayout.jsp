<%@ page import="com.adobe.aemds.guide.utils.GuideUtils" %>
<%@ page import="com.ajila.forms.joeltschopp.api.service.ConfigurationService" %>
<%@ page import="java.util.Locale" %>
<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<%@taglib prefix="sling" uri="http://sling.apache.org/taglibs/sling/1.0" %>
<sling:defineObjects/>

<%
    ConfigurationService configurationService = sling.getService(ConfigurationService.class);
    Locale locale = new Locale(GuideUtils.getGuideRuntimeLocale(slingRequest, resource));
    I18n i18n = new I18n(slingRequest.getResourceBundle(configurationService.getDictionary(), locale));
    String dataProgressbarText = i18n.get("joeltschopp-common-progressbar");
    String progressbarAriaText = i18n.get("joeltschopp-common-progressbar-aria");
%>

<div class="forms-navigator col-md-10 col-sm-10">
    <div class="progress-text"><p></p></div>
    <div id="ajila-progressbar-background" class="ajila-progressbar-background" style="width: 100%;">
        <div id="ajila-progressbar" class="ajila-progressbar progress-bar progress-bar-u" role="progressbar"
             aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
             data-progressbar-text="<%=dataProgressbarText%>" data-progressbar-aria-text="<%=progressbarAriaText%>" style="width: 0%"></div>
    </div>
</div>
