package com.ajila.forms.joeltschopp.internal;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Bundle activator.
 *
 * @author jtschopp
 * @author pschmidiger
 */
public class Activator implements BundleActivator {
    private static final Logger LOGGER = LoggerFactory.getLogger(Activator.class);

    @Override
    public void start(BundleContext context) {
        LOGGER.info(String.format("%s started", context.getBundle().getSymbolicName()));
    }

    @Override
    public void stop(BundleContext context) {
        LOGGER.info(String.format("%s stopped", context.getBundle().getSymbolicName()));
    }
}