# Ajila Forms joeltschopp

## Introduction
This project was originally created by the Ajila Forms Project Archetype.
> All information about what the initial setup provides can be found on the following Confluence page: https://ajila.atlassian.net/wiki/spaces/KB/pages/190797679/Create+new+Ajila+Forms+Project

### Prerequisites
The project runs on the Ajila Cloud Platform. Therefore you have to install the http://bitbucket.internal.ajila.com:7990/projects/AC/repos/ajila-cloud-platform/browse project on your local AEM server.
> For more details please consult the following Confluence page: https://ajila.atlassian.net/wiki/spaces/AJICLOUD/pages/615809093/The+mother+of+all+projects

### Installing
This chapter describes how to run the application locally or on a development server.

#### Run on local instance
Use the `local,autoInstallPackage` (author instance) or `local,autoInstallPackagePublish` (publish instance) maven profiles to install the application on the local instance.
0. mvn clean install -P local,autoInstallPackage
0. Open http://localhost:4502/crx/de and http://localhost:4502/system/console to check the installed status.

## Deployment
### Artefact
The following artefact can be used for any platform and can be built as follows:
0. mvn clean install
0. Install the artefact at the server with Bamboo Deployment Jobs (`mvn clean install -PautoInstallPackage -Daem.server=http://<HOST> -Daem.port=<PORT> -Daem.context=<CONTEXT> -Daem.user=<USER> -Daem.password=<PASSWORD>`) 
or with the CRX Package Manager /crx/packmgr.