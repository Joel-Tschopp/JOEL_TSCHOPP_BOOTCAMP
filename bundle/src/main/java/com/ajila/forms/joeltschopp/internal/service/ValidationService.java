package com.ajila.forms.joeltschopp.internal.service;

import com.ajila.forms.joeltschopp.api.service.ConfigurationService;
import com.ajila.forms.joeltschopp.internal.model.ClientException;
import com.ajila.forms.joeltschopp.internal.model.ClientExceptionMessage;

import com.adobe.aemds.guide.common.GuideError;
import com.adobe.aemds.guide.common.GuideValidationResult;
import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.GuideModelTransformer;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Validation API to prevent malicious intent.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = ValidationService.class)
public class ValidationService {
    static final String LOCALE = "de";

    @Reference
    private ConfigurationService configurationService;
    @Reference
    private GuideModelTransformer guideModelTransformer;

    /**
     * Use the serverside validation.
     *
     * @param formSubmitInfo The data.
     * @param exclusions The validation exclusions.
     */
    public void validate(FormSubmitInfo formSubmitInfo, String... exclusions) {
        try {
            GuideValidationResult validationResult = guideModelTransformer.validateData(formSubmitInfo.getData(), formSubmitInfo.getFormContainerResource(),
                    configurationService.getOutboundUrl(), LOCALE, "", "");

            List<GuideError> errorList = validationResult.getGuideErrorList();
            if (exclusions != null) {
                errorList = errorList.stream().filter(e -> {
                    for (String exclusion : exclusions) {
                        if (e.getSomExpression().contains(exclusion)) {
                            return false;
                        }
                    }
                    return true;
                }).collect(Collectors.toList());
            }

            if (!errorList.isEmpty()) {
                throw new ClientException(
                        String.format("Error while revalidating on server (%s)", errorList.stream().map(guideError -> guideError.getSomExpression() + ": " + guideError.getErrorMessage())),
                        ClientExceptionMessage.VALIDATION);
            }
        } catch (Exception e) {
            throw new ClientException("Error while revalidating on server", ClientExceptionMessage.VALIDATION);
        }
    }
}
