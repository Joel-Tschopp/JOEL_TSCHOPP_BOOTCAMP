package com.ajila.forms.joeltschopp.api.service;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;

/**
 * Provides the logic to process the form data and generate the PDF document.
 *
 * @author jtschopp
 * @author pschmidiger
 */
public interface FormSubmitService {
    /**
     * The method carries out the actual data processing. An occurred error is transmitted via the success method using status as follows:
     * <pre>
     *     guideResultObject.data.status = 'error'
     *     guideResultObject.data.messageSubject = {translated subject of the message}
     *     guideResultObject.data.messageBody = {translated body of the message}
     * </pre>
     *
     * @param slingRequest  Contains the data for executing the processing.
     * @param slingResponse Is used to send the response to the client.
     */
    void submit(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse);
}
