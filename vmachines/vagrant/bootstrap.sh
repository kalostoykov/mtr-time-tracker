#!/usr/bin/env bash

NVM_VERSION=4.4.7
PHPMYADMIN_VERSION=4.6.3

# Color helpers
export TERM=${TERM:-vt100} # avoid tput complaining when TERM is not set.
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
BOLD=$(tput bold)
NORMAL=$(tput sgr0)

MYSQL_LIST=$(cat <<EOF
### THIS FILE IS AUTOMATICALLY CONFIGURED ###
# You may comment out entries below, but any other modifications may be lost.
# Use command 'dpkg-reconfigure mysql-apt-config' as root for modifications.
deb http://repo.mysql.com/apt/ubuntu/ trusty mysql-apt-config
deb http://repo.mysql.com/apt/ubuntu/ trusty mysql-5.7
deb-src http://repo.mysql.com/apt/ubuntu/ trusty mysql-5.7
EOF
)

PHPMYADMIN_NAME=phpmyadmin
VHOST_PHPMYADIN=$(cat <<EOF
  <VirtualHost *:80>
        ServerAdmin webmaster@$PHPMYADMIN_NAME.mtr
        DocumentRoot /var/www/$PHPMYADMIN_NAME
        <Directory /var/www/$PHPMYADMIN_NAME/>
            Options +FollowSymLinks
            AllowOverride All
        </Directory>
        ServerName www.$PHPMYADMIN_NAME.mtr
        ErrorLog /var/log/apache2/logs/$PHPMYADMIN_NAME.www-error_log.log
        CustomLog /var/log/apache2/logs/$PHPMYADMIN_NAME.www-access_log.log common
  </VirtualHost>
EOF
)

PHPMYADMINCFG=$(cat <<'EOF'
$cfg["blowfish_secret"] = "qtdRoGmbc9{8IZr323xYcSN]0s)r$9b_JUnb{~Xz"; /* YOU MUST FILL IN THIS FOR COOKIE AUTH! */
EOF
)

BASHRC=$(cat <<'EOF'
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
EOF
)

all() { # Configure everything on a new machine.
    export LC_ALL="en_US.UTF-8" && \
    install_server_libs && \
    install_apache && \
    set_apache_rewrite_mode && \
    install_mysql && \
    install_memcached && \
    install_python && \
    install_dev_tools
}

set_apache_rewrite_mode() {
	sudo service apache2 reload
	sudo a2enmod rewrite
	sudo service apache2 restart
	sudo mkdir /var/log/apache2/logs/
}

install_apache() { # Install apache
    sudo apt-get install -y apache2
}

install_server_libs() { # Install server libs
    sudo apt-get update
	sudo apt-get install make
	sudo apt-get install -y libxml2
	sudo apt-get install -y libxml2-dev
	sudo apt-get install -y libssl-dev
	sudo apt-get install -y openssl
	sudo apt-get install -y git
	sudo apt-get install -y curl
	sudo apt-get install -y libsslcommon2-dev
	sudo apt-get install -y libcurl4-openssl-dev
    sudo apt-get install -y python-software-properties
    sudo apt-get install -y debconf-utils
    sudo apt-get install -y htop
    sudo apt-get install -y language-pack-en-base
    sudo apt-get update
}

install_dev_tools() { # Install dev tools
    # Add PHPMyadmin
    cd /var/www/ && sudo wget https://files.phpmyadmin.net/phpMyAdmin/$PHPMYADMIN_VERSION/phpMyAdmin-$PHPMYADMIN_VERSION-english.tar.gz
    cd /var/www/ && sudo tar -zxvf phpMyAdmin-$PHPMYADMIN_VERSION-english.tar.gz
    cd /var/www/ && sudo mv phpMyAdmin-$PHPMYADMIN_VERSION-english phpmyadmin
    cd /var/www/ && sudo rm phpMyAdmin-$PHPMYADMIN_VERSION-english.tar.gz

    sudo touch /etc/apache2/sites-available/$PHPMYADMIN_NAME.conf
    sudo sh -c "echo '${VHOST_PHPMYADIN}' > /etc/apache2/sites-available/$PHPMYADMIN_NAME.conf"
    sudo a2ensite $PHPMYADMIN_NAME.conf
    sudo service apache2 restart

    sudo cp /var/www/phpmyadmin/config.sample.inc.php /var/www/phpmyadmin/config.inc.php
    sudo sh -c "echo '${PHPMYADMINCFG}' >> /var/www/phpmyadmin/config.inc.php"
    sudo service apache2 restart

    # Add NVM
    cd $HOME && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
    nvm install $NVM_VERSION
    nvm use $NVM_VERSION
    sudo sh -c "echo 'nvm use ${NVM_VERSION}' >> $HOME/.bashrc"
    sudo sh -c "echo '${BASHRC}' >> $HOME/.bash_profile"

    # Add Bower
    npm install -g bower
    npm install -g typescript
}

install_mysql() { # Install mysql
    export DEBIAN_FRONTEND=noninteractive
    sudo sh -c "echo '${MYSQL_LIST}' > /etc/apt/sources.list.d/mysql.list"
    sudo apt-get update
    echo mysql-community-server mysql-community-server/re-root-pass password "parola" | sudo debconf-set-selections
    echo mysql-community-server mysql-community-server/root-pass password "parola" | sudo debconf-set-selections
	sudo -E apt-get --force-yes -y install mysql-community-server
    sudo apt-get install -y --force-yes libmysqlclient-dev
}

install_memcached() {
    sudo apt-get install -y memcached
    sudo service apache2 restart
}

install_python() { # Install Python
    cd $HOME && git clone https://github.com/yyuu/pyenv.git ~/.pyenv

    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bash_profile
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bash_profile
    echo 'eval "$(pyenv init -)"' >> ~/.bash_profile

    source ~/.bash_profile
    pyenv install 3.5.2
    pyenv global 3.5.2
    pip3 install virtualenv
    mkdir /srv/project/mtr-time-tracker-venv && cd /srv/project/mtr-time-tracker-venv && virtualenv .
    echo 'source /srv/project/mtr-time-tracker-venv/bin/activate' >> ~/.bash_profile
}

help() { # This help
    echo "Manage a local development server"
    echo
    echo "Usage: ${YELLOW}$0${NORMAL} <command> <arg1> ..."
    echo
	echo "Commands:"
    sed -r -n "s/([a-z_]+)\(\)+ *\{ *#(.*)$/  $BOLD\1$NORMAL:\2/gp" $0
}

cmd=$1
if [ -z "$cmd" ] ; then
    help
    exit 1
fi
shift
$cmd "$@"
