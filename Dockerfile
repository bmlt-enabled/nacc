FROM wordpress:5.8.2-php7.4-apache

RUN apt-get update && \
	apt-get install -y  --no-install-recommends ssl-cert && \
	rm -r /var/lib/apt/lists/* && \
	a2enmod ssl rewrite expires && \
	a2ensite default-ssl

RUN pecl install xdebug

ENV PHP_INI_PATH  /usr/local/etc/php/php.ini
ENV PHP_XDEBUG_ENABLED: 1

RUN echo "zend_extension=$(find /usr/local/lib/php/ -name xdebug.so)" >> ${PHP_INI_PATH} \
    && echo "xdebug.remote_port=10000" >> ${PHP_INI_PATH} \
    && echo "xdebug.remote_enable=1" >> ${PHP_INI_PATH} \
    && echo "xdebug.remote_connect_back=0" >> ${PHP_INI_PATH} \
    && echo "xdebug.remote_host=docker.for.mac.localhost" >> ${PHP_INI_PATH} \
    && echo "xdebug.idekey=NACC_DEBUG" >> ${PHP_INI_PATH} \
    && echo "xdebug.remote_autostart=1" >> ${PHP_INI_PATH} \
    && echo "xdebug.remote_log=/tmp/xdebug.log" >> ${PHP_INI_PATH}

EXPOSE 80
EXPOSE 443
