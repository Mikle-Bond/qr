# QR code generator in webpage

Based on library from [EasyProject](https://github.com/ushelp/EasyQRCodeJS)

## Docker

Docker image is based on [halverneus/static-file-server](https://github.com/halverneus/static-file-server)

Example `docker-compose.yml`

```yaml
networks:
    ingress: # null means default

x-templates:
    default: &default
        environment: &env
            TZ: # null value means read from .env file
        networks: &def-networks
            ingress:
        restart: &def-restart unless-stopped

services:
    qr:
        <<: *default

        # You can build it without cloning the repo
        build: https://github.com/Mikle-Bond/qr.git

        environment:
	    <<: *env
            PORT: 8080
            # Other useful options are listed here
	    # at https://github.com/halverneus/static-file-server

	# example of proxying using the caddy-docker-proxy
        labels: 
            caddy: qr.${BASE_DOMAIN}
            caddy.reverse_proxy: http://qr:8080

	# example of proxying only the port
	ports:
	    - "80:8080/tcp"
```

Example contents of .env file

```sh
BASE_DOMAIN=your.domain.tld
TZ=Your/TimeZone
```


