package com.ajila.forms.joeltschopp.internal.model;

/**
 * A thrown client exception in the code is interpreted by the <code>Exception Handler</code> and the corresponding translated messages are sent to the client.
 *
 * @author jtschopp
 * @author pschmidiger
 */
public class ClientException extends RuntimeException {
    private final ClientExceptionMessage clientErrorMessage;
    private final Object[] args;

    /**
     * Create a new client exception with the exception message and the client error message.
     *
     * @param message                The exception message for the log file.
     * @param clientExceptionMessage The message, which is transmitted translated to the client.
     * @param args                   Optional arguments, which are replaced in the message body by parameters (e.g. {0}).
     */
    public ClientException(String message, ClientExceptionMessage clientExceptionMessage, Object... args) {
        super(message);
        this.clientErrorMessage = clientExceptionMessage;
        this.args = args;
    }

    /**
     * Create a new client exception with the exception message, the cause exception and the client error message.
     *
     * @param message            The exception message for the log file.
     * @param cause              The exception that caused the problem.
     * @param clientErrorMessage The message, which is transmitted translated to the client.
     * @param args               Optional arguments, which are replaced in the message body by parameters (e.g. {0}).
     */
    public ClientException(String message, Throwable cause, ClientExceptionMessage clientErrorMessage, Object... args) {
        super(message, cause);
        this.clientErrorMessage = clientErrorMessage;
        this.args = args;
    }

    /**
     * Return the client error message keys.
     *
     * @return The client error message keys.
     */
    public ClientExceptionMessage getClientErrorMessage() {
        return clientErrorMessage;
    }

    /**
     * Return the optional arguments for the client error message body.
     *
     * @return Optional arguments for the client error message body.
     */
    public Object[] getArgs() {
        return args;
    }
}
