package com.ajila.forms.joeltschopp.internal.web;

import com.ajila.cloud.storage.api.model.File;
import com.ajila.cloud.storage.api.model.Temp;
import com.ajila.cloud.storage.api.repository.FileRepository;
import com.ajila.cloud.storage.api.repository.TempRepository;
import com.ajila.forms.joeltschopp.api.service.ConfigurationService;
import com.ajila.forms.joeltschopp.internal.model.Payload;
import com.ajila.forms.joeltschopp.internal.model.RequestParameter;

import org.apache.http.HttpStatus;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.Servlet;

/**
 * The servlet makes the document available in the response.
 *
 * @author jtschopp
 * @author pschmidiger
 */
@Component(immediate = true, service = Servlet.class,
        property = {
                "sling.servlet.methods=GET",
                "sling.servlet.paths=" + DocumentServlet.URL
        })
public class DocumentServlet extends SlingAllMethodsServlet {
    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentServlet.class);
    public static final String URL = "/bin/com/ajila/forms/joeltschopp/contract";
    private static final String CONTENT_DISPOSITION = "Content-disposition";
    private static final String INLINE_FILE = "inline; filename=\"%s\"";

    @Reference
    private ConfigurationService configurationService;
    @Reference
    private FileRepository fileRepository;
    @Reference
    private TempRepository tempRepository;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        if (request.getParameterMap().containsKey(RequestParameter.IDENTIFICATION.getName())) {
            try {
                UUID identification = UUID.fromString(request.getParameter(RequestParameter.IDENTIFICATION.getName()));
                Optional<Temp> optionalTemp = tempRepository.find(configurationService.getCredentials(), identification);
                if (optionalTemp.isPresent()) {
                    Temp temp = optionalTemp.get();
                    Optional<File> optionalFile = loadFile(temp);
                    if (optionalFile.isPresent()) {
                        File file = optionalFile.get();
                        response.setStatus(HttpStatus.SC_OK);
                        response.setHeader(CONTENT_DISPOSITION, String.format(INLINE_FILE, file.getFileName()));
                        response.setContentType(file.getContentType());
                        response.getOutputStream().write(file.getContent());
                    } else {
                        response.setStatus(HttpStatus.SC_NOT_FOUND);
                    }
                } else {
                    response.setStatus(HttpStatus.SC_NOT_FOUND);
                }
            } catch (Exception e) {
                LOGGER.error(e.getMessage(), e);
                response.setStatus(HttpStatus.SC_CONFLICT);
            }
        } else {
            response.setStatus(HttpStatus.SC_BAD_REQUEST);
        }
    }

    /**
     * Creates the URL to download the document. If the identification is <code>null</code>, the url will be an empty <code>String</code>.
     *
     * @param identification The identification of the document.
     * @return The URL to download the document.
     */
    public static String createUrl(UUID identification) {
        if (identification == null) {
            return "";
        } else {
            return URL.concat("?").concat(RequestParameter.IDENTIFICATION.getName()).concat("=").concat(identification.toString());
        }
    }

    private Optional<File> loadFile(Temp temp) {
        Map<String, String> payload = temp.getPayload();
        if (payload.containsKey(Payload.DOCUMENT_ID.getName())) {
            return fileRepository.find(configurationService.getCredentials(), UUID.fromString(payload.get(Payload.DOCUMENT_ID.getName())));
        }
        return Optional.empty();
    }
}
