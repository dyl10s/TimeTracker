# This file controls what happens to the frontend docker container on startup
# Generate the certificate after a few seconds
# waiting so nginx has some time to get started up
( sleep 5 ; certbot --nginx --non-interactive --agree-tos -m strohscd@mail.gvsu.edu -d *.timetrack.ml ) &
# Auto renew the certificate
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | tee -a /etc/crontab > /dev/null
#Start Nginx
nginx -g 'daemon off;'