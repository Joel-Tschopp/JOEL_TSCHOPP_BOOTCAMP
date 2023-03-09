package com.ajila.forms.joeltschopp.internal.model;

import com.ajila.cloud.api.service.Platform;
import com.ajila.cloud.platform.api.model.GenericForm;
import com.ajila.forms.joeltschopp.internal.web.DocumentServlet;

import org.apache.commons.lang.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * The class represents the form data XML as object tree and provides all access methods to the model.
 *
 * @author jtschopp
 * @author pschmidiger
 */
public class FormModel extends GenericForm<FormModel> {
    private static final String CREATED_DATE = "/joeltschoppForm/meta/tech/createdDate";
    private static final String DOCUMENT_URL = "/joeltschoppForm/meta/tech/documentUrl";
    private static final String IDENTIFICATION = "/joeltschoppForm/meta/tech/identification";
    private static final String PLATFORM = "/joeltschoppForm/meta/tech/platform";
    private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

    /**
     * Parse the xml and create a new model object.
     *
     * @param xml The xml of the model object.
     */
    public FormModel(String xml) {
        super(xml, "joeltschoppForm");
        if (StringUtils.isEmpty(getValue(CREATED_DATE))) {
            setValue(CREATED_DATE, new SimpleDateFormat(DATE_FORMAT).format(new Date()));
        }
    }

    /**
     * Set the document url into the meta data. An identification must be present as a precondition.
     *
     * @return The reference to this instance.
     */
    public FormModel setDocumentUrl() {
        setValue(DOCUMENT_URL, DocumentServlet.createUrl(getIdentification()));
        return this;
    }

    /**
     * Return the identification of the form data.
     *
     * @return The identification or <code>null</code>, if not available.
     */
    public UUID getIdentification() {
        String identification = getValue(IDENTIFICATION);
        if (StringUtils.isNotEmpty(identification)) {
            return UUID.fromString(identification);
        }
        return null;
    }

    /**
     * Set the identification into the meta data.
     *
     * @param identification The identification of the form data.
     * @return The reference to this instance.
     */
    public FormModel setIdentification(UUID identification) {
        setValue(IDENTIFICATION, identification.toString());
        return this;
    }

    /**
     * Set the platform into the meta data.
     *
     * @param platform The platform, on which the form was submitted.
     * @return The reference to this instance.
     */
    public FormModel setPlatform(Platform platform) {
        setValue(PLATFORM, platform.getProfile());
        return this;
    }
}
