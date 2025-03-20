# Migration Summary: pmimrankhan.xyz

## Migration Status: ✅ COMPLETED SUCCESSFULLY

The migration of the pmimrankhan.xyz website from the baremetal server (65.109.156.106) to the echoesofstreet server (95.216.25.234) has been completed successfully.

## What Was Migrated

1. ✅ Website files
2. ✅ Nginx configuration
3. ✅ SSL certificates
4. ✅ DNS configuration

## Current Status

- The website is now accessible via the new server IP: http://95.216.25.234
- The domain pmimrankhan.xyz is pointing to the new server
- HTTPS is configured and working correctly
- SSL certificates have been installed and configured

## Migration Steps Completed

1. ✅ Backed up website files from the source server
2. ✅ Transferred files to the target server
3. ✅ Set up Nginx configuration
4. ✅ Fixed directory structure and permissions
5. ✅ Updated DNS records to point to the new server
6. ✅ Installed and configured SSL certificates

## Technical Notes

- The blockchain contract remains unchanged as it's deployed on the blockchain, not on the server
- The SSL certificates were successfully transferred and configured
- The Nginx configuration had some syntax issues that were fixed during migration

## Maintenance Recommendations

1. **Regular Backups**:
   ```bash
   ssh echoesofstreet "sudo tar -czf /home/zeeshankhan/website-backup-$(date +%Y%m%d).tar.gz -C /var/www imran-khan-vote"
   ```

2. **SSL Certificate Renewal**:
   SSL certificates will automatically renew via the Certbot timer service.
   To manually check/renew:
   ```bash
   ssh echoesofstreet "sudo certbot renew --dry-run"
   ```

3. **Server Updates**:
   ```bash
   ssh echoesofstreet "sudo apt update && sudo apt upgrade -y"
   ```

## Troubleshooting

If you encounter any issues:

1. **Website Not Loading**:
   ```bash
   ssh echoesofstreet "sudo systemctl status nginx"
   ssh echoesofstreet "sudo tail -f /var/log/nginx/error.log"
   ```

2. **SSL Certificate Issues**:
   ```bash
   ssh echoesofstreet "sudo certbot renew --dry-run"
   ```

3. **Blockchain Connection Issues**:
   - Verify that the frontend is correctly configured with the contract address
   - Check browser console for any errors related to Web3 or MetaMask

## Rollback Plan

If necessary, you can revert to the original server:

1. Update DNS records to point back to the original IP (65.109.156.106)
2. No changes are needed on the original server as it should still have the website files
