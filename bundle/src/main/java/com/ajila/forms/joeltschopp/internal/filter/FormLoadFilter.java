package com.ajila.forms.joeltschopp.internal.filter;

import com.ajila.cloud.storage.api.model.Temp;
import com.ajila.cloud.storage.api.repository.TempRepository;
import com.ajila.cloud.platform.api.service.AbstractFormLoadFilter;
import com.ajila.forms.joeltschopp.internal.model.Payload;
import com.ajila.forms.joeltschopp.internal.model.RequestParameter;
import com.ajila.forms.joeltschopp.api.service.ConfigurationService;
import com.ajila.forms.joeltschopp.internal.model.FormLoadType;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.engine.EngineConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.Filter;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * OSGi filter handling the adaptive form load. The parameter evaluation is performed via the {@link FormLoadType}.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = Filter.class, property = {
        Constants.SERVICE_DESCRIPTION + "=ajila OSGi filter handling the adaptive form load.",
        EngineConstants.SLING_FILTER_SCOPE + "=" + EngineConstants.FILTER_SCOPE_REQUEST,
        "sling.filter.pattern=/.*",
        Constants.SERVICE_RANKING + "=-700"
})
public class FormLoadFilter extends AbstractFormLoadFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(FormLoadFilter.class);
    @Reference
    private ConfigurationService configurationService;
    
    @Reference
    private TempRepository tempRepository;

    @Override
    public void load(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
        try {
            FormLoadType formLoadType = FormLoadType.evaluate(slingRequest);
            switch (formLoadType) {
                case DATA:
                    loadData(slingRequest, formLoadType.getCurrentParameterValues(slingRequest));
                    break;
                case INITIALIZE:
                case DATA_REF:
                default:
                    break;
            }
        } catch (Exception e) {
            LOGGER.warn("Data cannot be pre-filled.", e);
        }
    }

    @Override
    protected String getApplication() {
        return configurationService.getApplication();
    }

    private void loadData(SlingHttpServletRequest slingRequest, Map<String, String> currentParameterValues) {
        String identification = currentParameterValues.get(RequestParameter.IDENTIFICATION.getName());
        LOGGER.debug(String.format("Try to load data from ''%s''", identification));
        Optional<Temp> temp = tempRepository.find(configurationService.getCredentials(), UUID.fromString(identification));
        if (temp.isPresent() && temp.get().getPayload().containsKey(Payload.FORMDATA.getName())) {
            LOGGER.debug(String.format("Load data from ''%s''", identification));
            String data = temp.get().getPayload().get(Payload.FORMDATA.getName());
            slingRequest.setAttribute("data", data);
        }
    }
}
