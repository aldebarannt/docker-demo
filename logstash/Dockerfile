FROM ubuntu:14.04

ENV REFRESHED_AT 2014-06-01

RUN apt-get -yqq update
RUN apt-get -yqq install wget
RUN wget -O - http://packages.elasticsearch.org/GPG-KEY-elasticsearch | apt-key add - 
RUN echo 'deb http://packages.elasticsearch.org/logstash/1.4/debian stable main' > /etc/apt/sources.list.d/logstash.list 
RUN apt-get -yqq update 
RUN apt-get -yqq install logstash 

ADD logstash.conf /etc/ 

WORKDIR /opt/logstash

EXPOSE 9200 9292

ENTRYPOINT [ "bin/logstash" ]
CMD [ "--config=/etc/logstash.conf", "web --backend 'elasticsearch:///?local'" ]