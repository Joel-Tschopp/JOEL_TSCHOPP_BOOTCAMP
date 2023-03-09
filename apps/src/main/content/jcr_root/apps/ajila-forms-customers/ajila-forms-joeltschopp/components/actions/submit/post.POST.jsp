<%@ page import="com.ajila.forms.joeltschopp.api.service.FormSubmitService" %>
<%@ page import="org.apache.commons.httpclient.HttpStatus" %>
<%@ page import="java.util.Objects" %>
<%@include file="/libs/fd/af/components/guidesglobal.jsp"%>
<%@taglib prefix="sling" uri="http://sling.apache.org/taglibs/sling/1.0" %>
<sling:defineObjects/>

<%
    try {
        FormSubmitService formSubmitService = sling.getService(FormSubmitService.class);
        Objects.requireNonNull(formSubmitService, "The form submit service is not available.").submit(slingRequest, slingResponse);
    } catch (NullPointerException e) {
        slingResponse.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
        throw new RuntimeException(e);
    }
%>