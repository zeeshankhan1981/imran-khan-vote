# Deployment Guide for Imran Khan Voting dApp

This guide will walk you through deploying the Imran Khan Voting dApp to your Hetzner bare metal server and the Polygon network.

## Server Details
- **Name**: factoura
- **Distribution**: Ubuntu 24.04 LTS
- **IP**: 65.109.156.106
- **Users**: root, zeeshankhan

## 1. Smart Contract Deployment to Polygon

### Why Polygon?
Polygon is significantly cheaper than Ethereum for gas fees, making it more accessible for users to interact with your contract without spending much on transaction fees.

### Steps to Deploy the Smart Contract

1. **Set up your environment**:
   - Fill in the `.env` file with your Infura/Alchemy API key and private key
   - You can get free testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

2. **Deploy to Polygon Mumbai Testnet first for testing**:
   ```bash
   ./deploy-contract.sh
   ```

3. **Note the deployed contract address** and update it in `frontend/src/App.jsx`

4. **For mainnet deployment** (when ready), edit `deploy-contract.sh` to use the polygon network:
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

## 2. Frontend Deployment to Hetzner Server

### Prepare the Deployment Package
1. **Build the frontend and prepare deployment files**:
   ```bash
   ./deploy-to-server.sh
   ```

2. **Transfer files to your server**:
   ```bash
   scp -r deploy/* zeeshankhan@65.109.156.106:/home/zeeshankhan/imran-khan-vote/
   ```

### Server Setup
1. **SSH into your server**:
   ```bash
   ssh zeeshankhan@65.109.156.106
   ```

2. **Copy the server setup script**:
   ```bash
   scp server-setup.sh zeeshankhan@65.109.156.106:/home/zeeshankhan/
   ```

3. **Run the server setup script**:
   ```bash
   cd /home/zeeshankhan
   chmod +x server-setup.sh
   ./server-setup.sh
   ```

4. **Copy the application files to the web root**:
   ```bash
   sudo cp -r /home/zeeshankhan/imran-khan-vote/* /var/www/imran-khan-vote/
   ```

5. **Set up a domain name** (optional):
   - Point your domain to your server IP (65.109.156.106)
   - Update the nginx configuration in `/etc/nginx/sites-available/imran-khan-vote.conf`
   - Uncomment the SSL setup line in the server-setup.sh script and run it again

## 3. Testing Your Deployment

1. **Visit your site**:
   - If using a domain: https://your-domain.com
   - If using IP directly: http://65.109.156.106

2. **Connect with MetaMask**:
   - Ensure MetaMask is configured for Polygon network
   - For Mumbai testnet:
     - Network Name: Mumbai Testnet
     - RPC URL: https://rpc-mumbai.maticvigil.com/
     - Chain ID: 80001
     - Currency Symbol: MATIC
   - For Polygon Mainnet:
     - Network Name: Polygon Mainnet
     - RPC URL: https://polygon-rpc.com/
     - Chain ID: 137
     - Currency Symbol: MATIC

3. **Test voting functionality**

## 4. Maintenance and Monitoring

1. **Monitor your server**:
   ```bash
   sudo apt install -y htop
   htop
   ```

2. **Check nginx logs**:
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Set up automatic updates**:
   ```bash
   sudo apt install -y unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

## 5. Backup Strategy

1. **Backup your contract address and ABI**:
   - Store the contract address and ABI in a safe place
   - The contract itself is immutable once deployed to the blockchain

2. **Backup your frontend code**:
   ```bash
   sudo cp -r /var/www/imran-khan-vote /home/zeeshankhan/backups/
   ```

## 6. Troubleshooting

1. **If nginx fails to start**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

2. **If the site is not accessible**:
   - Check firewall settings:
   ```bash
   sudo ufw status
   sudo ufw allow 'Nginx Full'
   ```

3. **If MetaMask cannot connect**:
   - Ensure your RPC settings are correct
   - Check browser console for CORS errors
