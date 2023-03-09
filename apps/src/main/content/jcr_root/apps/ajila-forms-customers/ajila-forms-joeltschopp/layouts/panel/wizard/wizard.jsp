<%@include file="/libs/fd/af/components/guidesglobal.jsp"%>
<ui:includeClientLib categories="ajila.forms.joeltschopp"/>
<div id="${guidePanel.id}_layoutContainer" class="guideLayout row guideWizardLayout" style="position:relative;">
    <div class="col-md-12 clearfix">
        <cq:include script = "defaultNavigatorLayout.jsp" />
    </div>
    <div class="col-md-1 col-sm-1 wizard-nav-arrow wizard-nav-prev"
         data-guide-wizard-nav='{"panelId": "${guidePanel.id}", "focusOption": "prevItem", "runCompletionScript": true, "skipFieldFocus": false}'>
    </div>
    <div id="#${guidePanel.id}_layoutPanelContainer" class="col-md-10 col-sm-10 PanelContainer afWizardPanel">
        <c:if test="${fn:length(guidePanel.description) > 0}">
            <div class="<%=GuideConstants.GUIDE_PANEL_DESCRIPTION%> guideWizardDescription">
                ${guide:encodeForHtml(guidePanel.description,xssAPI)}
                <cq:include script="/libs/fd/af/components/panel/longDescription.jsp"/>
            </div>
        </c:if>
        <cq:include script = "panelContainer.jsp"/>
    </div>
    <div class="col-md-1 col-sm-1 wizard-nav-arrow wizard-nav-next"
         data-guide-wizard-nav='{"panelId": "${guidePanel.id}", "focusOption": "nextItem", "runCompletionScript": true, "skipFieldFocus": false}'>
    </div>
</div>