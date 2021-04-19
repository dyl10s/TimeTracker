# This file controls what happens to the frontend docker container on startup

# Only generate the SSL cert if the information is filled out 
if [[ "$SSLEmail" == "SSLEmailHere" || -z "$SSLEmail" || "$Domain1" == "Domain1Here" || -z "$Domain1" || "$Domain2" == "Domain2Here" || -z "$Domain2" ]]; then
    echo "Defaults or empty values detected, not generating SSL Cert. SSLEmail, Domain1, and Domain2 are required. If you only have 1 domain Domain1 and Domain2 can be the same values"
else
    # Generate the certificate after a few seconds
    # waiting so nginx has some time to get started up
    ( sleep 10 ; certbot --nginx --non-interactive --agree-tos -m $SSLEmail -d $Domain1 -d $Domain2 ) &
    # Auto renew the certificate I think this should work for auto renewal, if not the app will just need to be restarted after 6 months
    # I cant find a good way to test the nginx reloading part to verify it works
    ( echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q && nginx -s reload" | tee -a /etc/crontab > /dev/null ) &
fi

#Start Nginx
nginx -g 'daemon off;'