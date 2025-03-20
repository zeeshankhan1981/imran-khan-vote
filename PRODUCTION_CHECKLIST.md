# Production Deployment Checklist

## Pre-Deployment Checks

- [x] Smart contract deployed to Ethereum Mainnet
- [x] Smart contract verified on Etherscan
- [x] Frontend updated with correct contract address
- [x] All references to test networks removed
- [x] Thank you popup implemented and tested
- [x] MetaMask connection error handling improved
- [x] Frontend successfully built with `npm run build`
- [x] All changes committed to GitHub repository

## Deployment Steps

1. **Prepare for Deployment**
   - [x] Build the frontend with `cd frontend && npm run build`
   - [x] Create deployment package with `./deploy-to-production.sh`

2. **Server Configuration**
   - [ ] Ensure Nginx is properly configured on the server
   - [ ] Verify SSL certificates are valid and up-to-date
   - [ ] Check server firewall settings

3. **Deployment**
   - [ ] Run the deployment script: `./deploy-to-production.sh`
   - [ ] Verify files are correctly placed in `/var/www/imran-khan-vote`
   - [ ] Check file permissions are set correctly

4. **Post-Deployment Verification**
   - [ ] Test the application at http://pmimrankhan.xyz
   - [ ] Test the application at http://65.109.156.106
   - [ ] Test the application at https://pmimrankhan.unstoppable.link
   - [ ] Verify wallet connection works
   - [ ] Test voting functionality with a real wallet
   - [ ] Verify thank you popup appears after voting
   - [ ] Check that all tabs (Vote, Facts, Timeline) work correctly
   - [ ] Test on mobile devices

## Rollback Plan

If issues are encountered after deployment:

1. SSH into the server: `ssh echoesofstreet`
2. Navigate to the backups directory: `cd /var/www/backups`
3. Identify the most recent backup: `ls -lt`
4. Restore the backup:
   ```bash
   rm -rf /var/www/imran-khan-vote/*
   cp -r /var/www/backups/[backup-folder]/* /var/www/imran-khan-vote/
   chown -R www-data:www-data /var/www/imran-khan-vote
   chmod -R 755 /var/www/imran-khan-vote
   systemctl restart nginx
   ```

## Monitoring

After deployment, monitor:

- Server performance
- Application errors in logs
- User feedback
- Transaction success rates

## Contact Information

If issues arise during deployment, contact:
- System Administrator: [Your Name]
- Contract Developer: [Developer Name]
- Frontend Developer: [Developer Name]
