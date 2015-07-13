#coding: utf-8

from fabric.api import *

env.use_ssh_config = True

def deploy():
  with cd('/opt/www/repository'):
    run("git pull")

  with cd('/opt/www'):
    with settings(warn_only = True):
      sudo("rm -fr old")
      sudo("mv current old")
      sudo("cp -r repository current")

def setup():
  sudo("apt-get update")
  sudo("apt-get -y install nginx git")
  sudo("mkdir -p /opt/www/current")
  sudo("chown -R ubuntu:ubuntu /opt/www")
  
  put("~/.ssh/gitKey", "~/.ssh/gitKey")
  put("deploy/ssh.config", "~/.ssh/config")
  run("chmod 600 ~/.ssh/gitKey")

  with cd('/opt/www/'):
    run("git clone https://github.com/victormartinezsimon/PaginaWeb.git")
    run("mv PaginaWeb repository")

  put("deploy/www.nginx", "/etc/nginx/sites-available/www.conf", True)
  sudo("ln -s /etc/nginx/sites-available/www.conf /etc/nginx/sites-enabled/www.conf")
  put("deploy/nginx.conf", "/etc/nginx/nginx.conf", True)
  sudo("rm /etc/nginx/sites-enabled/default")
  sudo("mkdir -p /opt/nginx/cache")
  sudo("mkdir /var/log/opt")
  sudo("/usr/sbin/nginx -s reload")