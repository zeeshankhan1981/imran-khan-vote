# Migration Guide: Moving pmimrankhan.xyz to a New Server

This guide outlines the process for migrating the pmimrankhan.xyz website from the baremetal server (65.109.156.106) to the echoesofstreet server (95.216.25.234).

## Overview

The migration involves:
1. Backing up the website files from the source server
2. Transferring them to the target server
3. Setting up Nginx and SSL certificates on the target server
4. Updating DNS records to point to the new server

## Important Notes

- **Blockchain Contract**: The smart contract is deployed on the blockchain (Ethereum/Polygon) and remains unchanged during server migration.
- **Domain Configuration**: After migration, you'll need to update DNS records to point to the new server IP.
- **SSL Certificates**: The migration script attempts to transfer existing SSL certificates if available.

## Migration Steps

### 1. Prepare Your Environment

Ensure you have SSH access to both servers:
```bash
# Test connection to source server
ssh baremetal

# Test connection to target server
ssh echoesofstreet
```

If you haven't set up SSH aliases, you can use the full hostnames:
```bash
ssh username@65.109.156.106  # baremetal
ssh username@95.216.25.234   # echoesofstreet
```

### 2. Run the Migration Script

We've created a migration script that automates the process:

```bash
# Make the script executable
chmod +x migrate-to-echoesofstreet.sh

# Run the migration script
./migrate-to-echoesofstreet.sh
```

The script will:
- Create a local backup of the website files
- Set up Nginx on the target server
- Transfer the website files
- Configure Nginx with the appropriate settings
- Transfer SSL certificates if available

### 3. Update DNS Records

After successful migration, update your DNS records to point to the new server:

1. Log in to your domain registrar (where pmimrankhan.xyz is registered)
2. Update the A records to point to the new IP address (95.216.25.234)
3. If you're using Unstoppable Domains, update the IPFS/DNS settings accordingly

### 4. Verify the Migration

After DNS propagation (which can take up to 48 hours):

1. Visit https://pmimrankhan.xyz to ensure the website loads correctly
2. Test the voting functionality to ensure the blockchain integration works
3. Check that SSL is working properly (the site should load over HTTPS without warnings)

### 5. Troubleshooting

If you encounter issues:

#### Website Not Loading
```bash
# Check Nginx status on the target server
ssh echoesofstreet "sudo systemctl status nginx"

# Check Nginx configuration
ssh echoesofstreet "sudo nginx -t"

# Check Nginx logs
ssh echoesofstreet "sudo tail -f /var/log/nginx/error.log"
```

#### SSL Certificate Issues
```bash
# Install certbot if needed
ssh echoesofstreet "sudo apt install -y certbot python3-certbot-nginx"

# Generate new SSL certificates
ssh echoesofstreet "sudo certbot --nginx -d pmimrankhan.xyz -d www.pmimrankhan.xyz"
```

#### Blockchain Connection Issues
- Verify that the frontend is correctly configured with the contract address
- Check browser console for any errors related to Web3 or MetaMask

## Rollback Plan

If necessary, you can revert to the original server:

1. Update DNS records to point back to the original IP (65.109.156.106)
2. No changes are needed on the original server as it should still have the website files

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Unstoppable Domains Documentation](https://docs.unstoppabledomains.com/)
- [Polygon Documentation](https://polygon.technology/developers)
