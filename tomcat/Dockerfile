FROM tomcat

RUN mkdir /usr/local/tomcat/webapps/app

ADD app /usr/local/tomcat/webapps/app

ENTRYPOINT ["/usr/local/tomcat/bin/catalina.sh", "run"]