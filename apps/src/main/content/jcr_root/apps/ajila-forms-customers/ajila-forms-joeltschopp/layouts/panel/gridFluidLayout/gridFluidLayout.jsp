<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<%@include file="/libs/foundation/global.jsp" %>
<%@page import="com.adobe.aemds.guide.common.GuideNode,
                com.adobe.aemds.guide.common.GuidePanel,
                java.util.List,
                javax.jcr.Node" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ taglib prefix="guide" uri="http://www.adobe.com/taglibs/guides/2.0" %>
<c:if test="${guidePanel.hasToolbar && (guidePanel.toolbarPosition == 'Tsop') }">
    <sling:include path="${guidePanel.toolbar.path}"/>
</c:if>

<%
    Resource panelResource = ((GuidePanel) request.getAttribute("guidePanel")).getResource();
    Node panelNode = panelResource.adaptTo(Node.class);
    String cssClass = "";
    String repeatable = "";
    String dataPanel = "";
    if (panelNode.hasProperty("jcr:title")) {
        dataPanel = "data-panel=\"" + panelNode.getProperty("jcr:title").getString() + "\"";
        if ("rootPanel".equals(panelResource.getParent().getParent().getName())) {
            dataPanel += " data-is-root";
        }
    }

    // mark the panel as repeatable as soon as a max and min value is available
    if (panelNode.hasProperty("maxOccur") && panelNode.hasProperty("minOccur")) {
        repeatable = "data-repeatable";
    }

    // Mark the panel either as a repeat container as soon as a child panel is repeatable. Mark the panel as a repeat container button as soon as a child panel contains a remove button.
    if ("ajila-forms-customers/ajila-forms-joeltschopp/components/controls/panel".equals(panelResource.getResourceType())) {
        for (Resource item : panelResource.getChildren()) {
            if ("ajila-forms-customers/ajila-forms-joeltschopp/layouts/panel/gridFluidLayout".equals(item.getResourceType())) {
                for (Resource child : item.getChildren()) {
                    if ("ajila-forms-customers/ajila-forms-joeltschopp/components/controls/removebutton".equals(child.getResourceType())) {
                        cssClass += "repeatcontainerbuttons ";
                    } else if ("ajila-forms-customers/ajila-forms-joeltschopp/components/controls/hidebutton".equals(child.getResourceType())) {
                        cssClass += "repeatcontainerheader ";
                    } else {
                        Node childNode = child.adaptTo(Node.class);
                        if ("ajila-forms-customers/ajila-forms-joeltschopp/components/controls/panel".equals(child.getResourceType()) && childNode.hasProperty("maxOccur") && childNode.hasProperty("minOccur")) {
                            cssClass += "repeatcontainer ";
                        }
                    }
                }
            }
        }
    }
%>

<div id="${guidePanel.id}_guide-item-container" class="guideLayout guideGridFluidLayout <%= cssClass %>" <%= repeatable %> <%= dataPanel %>>
    <%
        // Evaluate the hideTitle, title and description field for showing the correct panel title
        boolean showTitle = false;
        String title = "";
        if (!"rootPanel".equals(panelResource.getParent().getParent().getName())) {
            if (panelNode.hasProperty("jcr:description") && StringUtils.isNotEmpty(panelNode.getProperty("jcr:description").getString())) {
                title = panelNode.getProperty("jcr:description").getString();
            } else if (panelNode.hasProperty("jcr:title")) {
                title = panelNode.getProperty("jcr:title").getString();
            }
            if (panelNode.hasProperty("hideTitle")) {
                showTitle = !panelNode.getProperty("hideTitle").getBoolean();
            } else {
                showTitle = true;
            }
        }
        if (showTitle && StringUtils.isNotEmpty(title)) { %>
    <c:set var="title" value="<%=title%>"/>
    <div class="<%=GuideConstants.GUIDE_PANEL_DESCRIPTION%> guideGridFluidDescription"
         style="${guide:encodeForHtmlAttr(guidePanel.panelDescriptionInlineStyles,xssAPI)}">
        <h3>${guide:encodeForHtml(title,xssAPI)}</h3>
    </div>
    <% }%>

    <cq:include script="/libs/fd/af/components/panel/longDescription.jsp"/>
    <%
        int columns = 1;

        Map<String, Object> layoutproperties = NodeStructureUtils.getLayoutProperties(resource, slingRequest);
        if (layoutproperties.containsKey("columns")) {
            columns = Integer.parseInt(String.valueOf(layoutproperties.get("columns")));
        }
        List elements = ((GuidePanel) request.getAttribute("guidePanel")).getItems();
        int renderedElements = 0;
        int availableColumns;
        int size = elements.size();
        int spanvalue = (GuideConstants.TOTAL_LAYOUT_GRIDS) / columns;
        for (; renderedElements < size; ) {
            availableColumns = columns;
    %>
    <div class="row">
        <%
            for (; (renderedElements < size && availableColumns > 0); ) {
                GuideNode guideField = (GuideNode) elements.get(renderedElements++);
                int colspan = guideField.getColspan();
                if (colspan > columns) {
                    colspan = columns;
                }
                if (colspan <= availableColumns) {
        %>
        <div id="<%= guideField.getId()%>_guide-item" class="col-md-<%=(spanvalue * colspan)%>">
            <guide:renderItem path="<%= guideField.getPath() %>"/>
        </div>
        <%
                    availableColumns = availableColumns - colspan;
                } else {
                    renderedElements--;
                    break;
                }
            }
        %>
    </div>
    <% } %>
</div>
<cq:include script="parsys.html"/>
<c:if test="${guidePanel.hasToolbar && (guidePanel.toolbarPosition == 'Bottom') }">
    <sling:include path="${guidePanel.toolbar.path}"/>
</c:if>
