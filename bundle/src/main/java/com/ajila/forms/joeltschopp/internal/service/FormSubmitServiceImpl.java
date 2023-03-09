package com.ajila.forms.joeltschopp.internal.service;


import com.ajila.cloud.api.model.auditing.Action;
import com.ajila.cloud.api.model.auditing.Record;
import com.ajila.cloud.api.model.auditing.Status;
import com.ajila.cloud.api.service.CloudConfigurationService;
import com.ajila.cloud.api.service.Platform;
import com.ajila.cloud.auditing.api.repository.RecordRepository;
import com.ajila.cloud.storage.api.model.Command;
import com.ajila.cloud.storage.api.model.File;
import com.ajila.cloud.storage.api.model.Temp;
import com.ajila.cloud.storage.api.repository.CommandRepository;
import com.ajila.cloud.storage.api.repository.FileRepository;
import com.ajila.cloud.storage.api.repository.TempRepository;
import com.ajila.forms.joeltschopp.api.service.ConfigurationService;
import com.ajila.forms.joeltschopp.api.service.FormSubmitService;
import com.ajila.forms.joeltschopp.internal.model.FormLoadType;
import com.ajila.forms.joeltschopp.internal.model.FormModel;
import com.ajila.forms.joeltschopp.internal.model.Payload;
import com.ajila.forms.pdf.api.service.PdfRenderOptions;
import com.ajila.forms.pdf.api.service.PdfService;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.aemds.guide.utils.GuideSubmitUtils;
import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.forms.common.service.FileAttachmentWrapper;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * OSGi service, which provides the logic from {@link FormSubmitService}.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = FormSubmitService.class)
public class FormSubmitServiceImpl implements FormSubmitService {
    private static final Logger LOGGER = LoggerFactory.getLogger(FormSubmitServiceImpl.class);

    @Reference
    private ConfigurationService configurationService;
    @Reference
    private ExceptionHandler exceptionHandler;
    @Reference
    private ValidationService validationService;
    @Reference
    private CloudConfigurationService cloudConfigurationService;
    @Reference
    private CommandRepository commandRepository;
    @Reference
    private FileRepository fileRepository;
    @Reference
    private PdfService pdfService;
    @Reference
    private RecordRepository recordRepository;
    @Reference
    private TempRepository tempRepository;

    @Override
    public void submit(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
        try {
            FormSubmitInfo formSubmitInfo = (FormSubmitInfo) slingRequest.getAttribute(GuideConstants.FORM_SUBMIT_INFO);
            validationService.validate(formSubmitInfo);
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug(String.format("Submitting the form ''%s''", formSubmitInfo.getFormContainerPath()));
            }

            UUID identification = UUID.randomUUID();
            recordRepository.create(configurationService.getCredentials(), new Record().setTransaction(identification).setAction(Action.transaction).setStatus(Status.initialize));

            FormModel formModel = new FormModel(formSubmitInfo.getData());
            formModel.setIdentification(identification);
            formModel.setPlatform(cloudConfigurationService.getPlatform());
            formSubmitInfo.setData(formModel.marshall());

            Temp temp = new Temp(identification).setTimeToLiveInSeconds(configurationService.getTimeToLive());
            createDocumentOfRecord(formSubmitInfo, formModel, temp);
            temp.getPayload().put(Payload.FORMDATA.getName(), formModel.marshall());
            tempRepository.create(configurationService.getCredentials(), temp);

            commandRepository.finish(configurationService.getCredentials(), new Command());
            doConfirmation(slingRequest, temp.getId());
        } catch (Exception e) {
            exceptionHandler.handleSubmitException(slingRequest, e);
        }
    }

    private void createDocumentOfRecord(FormSubmitInfo formSubmitInfo, FormModel formModel, Temp temp) {
        if (GuideUtils.isDORConfigured(formSubmitInfo.getFormContainerResource())) {
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug(String.format("Rendering the document ''%s''", formSubmitInfo.getFormContainerPath()));
            }
            PdfRenderOptions pdfOptions = new PdfRenderOptions().setDoFlatten(true).setSupportAccessibility(true);
            pdfService.render(formSubmitInfo, pdfOptions);
            if (!Platform.prod.equals(cloudConfigurationService.getPlatform())) {
                pdfService.applyWatermark(formSubmitInfo, Platform.test.name().toUpperCase());
            }
            FileAttachmentWrapper documentOfRecord = formSubmitInfo.getDocumentOfRecord();
            File file = new File().setFileName(documentOfRecord.getFileName()).setContentType(documentOfRecord.getContentType()).setContent(documentOfRecord.getValue())
                    .setTimeToLiveInSeconds(configurationService.getTimeToLive());
            fileRepository.create(configurationService.getCredentials(), file);
            temp.getPayload().put(Payload.DOCUMENT_ID.getName(), file.getId().toString());
            formModel.setDocumentUrl();
        }
    }

    private void doConfirmation(SlingHttpServletRequest slingRequest, UUID identification) {
        Map<String, String> redirectParameters = new HashMap<>();
        GuideSubmitUtils.setRedirectUrl(slingRequest, configurationService.getConfirmationPage());
        FormLoadType.DATA.appendUrlParameter(redirectParameters, identification.toString());

        if (Platform.local.equals(cloudConfigurationService.getPlatform())) {
            redirectParameters.put("wcmmode", "disabled");
        }
        GuideSubmitUtils.setRedirectParameters(slingRequest, redirectParameters);
    }
}
