package com.ajila.forms.joeltschopp.internal.service;

import com.ajila.forms.joeltschopp.internal.model.ClientException;
import com.ajila.forms.joeltschopp.internal.model.ClientExceptionMessage;

import com.adobe.aemds.guide.utils.GuideSubmitUtils;

import org.osgi.service.component.annotations.Component;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * The exception handler processes all exceptions that have occurred and sends them back to the client as a response body with the status 200. An occurred error is transmitted via the success method using status as
 * follows:
 * <pre>
 *     guideResultObject.data.status = 'error'
 *     guideResultObject.data.messageSubject = {translated subject of the message}
 *     guideResultObject.data.messageBody = {translated body of the message}
 * </pre>
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = ExceptionHandler.class)
public class ExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandler.class);
    private static final String STATUS = "status";
    private static final String ERROR = "error";
    private static final String MESSAGE_BODY = "messageBody";

    /**
     * Handle an exception which occurs while submitting the form. The status, messageSubject and messageBody will send as redirect parameter to the client. The client can access the data on guideResultObject.data.*.
     *
     * @param slingRequest The request object, on which the data will set.
     * @param throwable    The occured exception.
     */
    public void handleSubmitException(SlingHttpServletRequest slingRequest, Throwable throwable) {
        LOGGER.error(throwable.getMessage(), throwable);

        Map<String, String> redirectParameters = new HashMap<>();
        redirectParameters.put(STATUS, ERROR);
        ClientExceptionMessage clientErrorMessage = ClientExceptionMessage.COMMUNICATION;
        if (throwable instanceof ClientException) {
            ClientException clientException = (ClientException) throwable;
            clientErrorMessage = clientException.getClientErrorMessage();
        }
        redirectParameters.put(MESSAGE_BODY, clientErrorMessage.getBody());
        GuideSubmitUtils.setRedirectParameters(slingRequest, redirectParameters);
    }
}
