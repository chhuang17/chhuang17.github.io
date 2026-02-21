---
title: How to Use Podman on Windows
date: 2024-09-20
lang: en
category: Tech
popularity: 40
excerpt: A practical guide to setting up Podman on Windows — installation, pulling images from Docker Hub, configuring private registries with self-signed certificates, and VS Code integration.
---

How to Use Podman on Windows
===

##### Highlights: Podman, Container, DevOps, Windows, VS Code Integration

## What is Podman?

Podman is an open-source container management tool released by Red Hat. It follows the [OCI (Open Container Initiative)](https://opencontainers.org/) standard, meaning that images that run on Docker can generally run on Podman as well.

If you have prior experience with Docker, transitioning to Podman is almost seamless — many of the commands are interchangeable.

## Installing Podman

Follow the instructions on the [official Podman website](https://podman.io/) to get started. Podman also offers a Desktop version for Windows and macOS, providing a graphical interface for container management. Unlike Docker Desktop, however, installing Podman Desktop does **not** automatically install the Podman engine — you need to install it separately.

Don't worry though — after installing Podman Desktop, if it can't detect the Podman engine, it will prompt you to install it.

## Pulling Images from a Registry

If you run `podman pull <IMAGE_NAME>` directly, you may not find the image you're looking for. This is because Podman's default registry is not Docker Hub, and most public images are hosted there. There are two solutions:

1. **Add the `docker.io/` prefix** to the image name, e.g., `podman pull docker.io/library/python:3.10-slim`
2. **Set Docker Hub as the default registry** by editing the Podman registries configuration

To configure the default registry, edit `/etc/containers/registries.conf` (on the Podman machine) and add:

```toml
unqualified-search-registries = ["docker.io"]
```

## Configuring a Private Registry with Self-Signed Certificates

When connecting to a private container registry that uses a self-signed certificate, Podman needs to be configured to trust that certificate. Here's how to set it up:

1. Obtain the CA certificate (`.crt` file) from your registry administrator
2. Place the certificate in the correct directory structure under `/etc/containers/certs.d/`

The directory structure **must** follow this pattern — you cannot simply place the certificate directly under `certs.d/`:

```
/etc/containers/certs.d/
└── <registry-hostname:port>/
    └── ca.crt
```

For example, if your private registry is hosted at `registry.example.com:5000`:

```
/etc/containers/certs.d/
└── registry.example.com:5000/
    └── ca.crt
```

When Podman connects to a registry, it looks for certificates **only** in the subdirectory matching that registry's hostname (and port). If no matching directory exists, no additional trust certificates will be loaded.

> **Note:** If you encounter TLS certificate errors, double-check that the directory name exactly matches the registry hostname and port used in your `podman pull` command.

## VS Code Integration

To use Podman with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in VS Code:

1. Open **Settings** (Ctrl + ,)
2. Search for **dev containers** in the search bar
3. Navigate to **Dev > Containers: Docker Path**
4. Change the value from `docker` to `podman`

<!-- TODO: add screenshot showing VS Code Dev Containers setting -->

After this configuration, the Dev Containers extension will use Podman instead of Docker for all container operations.

## References

- [Podman Official Website](https://podman.io/)
- [Pull Official Images From Docker Hub Using Podman](https://www.baeldung.com/ops/podman-pull-image-docker-hub)
- [Alternate ways to install Docker (VS Code Docs)](https://code.visualstudio.com/remote/advancedcontainers/docker-options)
