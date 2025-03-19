# Imran Khan Voting dApp

A modern, decentralized application that allows users to vote on whether Imran Khan is the rightful Prime Minister of Pakistan following the February 8, 2024 elections. The application features a sleek UI, blockchain-based voting, and NFT rewards for voters.

![Imran Khan Vote App](https://i.imgur.com/example.png)

## Live Demo

The application is live at:
- **Direct IP**: [http://65.109.156.106](http://65.109.156.106)
- **Traditional Domain**: [http://pmimrankhan.xyz](http://pmimrankhan.xyz)
- **Unstoppable Domain**: [pmimrankhan.unstoppable](https://pmimrankhan.unstoppable.link)

## Features

- **Blockchain-Based Voting**: Secure, transparent voting on the Ethereum blockchain
- **NFT Rewards**: Each voter receives a commemorative NFT badge
- **Multi-Tab Interface**: Vote, view election facts, and explore the timeline
- **Mobile Responsive**: Optimized for all device sizes
- **Web3 Integration**: Connect with MetaMask or other Ethereum wallets
- **Censorship-Resistant**: Hosted on traditional servers and accessible via Unstoppable Domains

## Project Structure

- `contracts/` - Contains the Solidity smart contract
- `scripts/` - Contains deployment scripts
- `frontend/` - Contains the React frontend application
- `test/` - Contains smart contract tests

## Smart Contract

The smart contract is a voting contract that allows users to vote "Yes" or "Absolutely Yes" to the question "Is Imran Khan the rightful Prime Minister of Pakistan?". The contract:

- Records votes on the Ethereum blockchain
- Emits events for each vote cast
- Maintains a permanent record of voter support

## Technical Stack

- **Frontend**: React, Vite, TailwindCSS
- **Blockchain**: Ethereum, Solidity
- **Development**: Hardhat, Ethers.js
- **Deployment**: Nginx, Baremetal Server, Unstoppable Domains

## Setup and Deployment

### Prerequisites

- Node.js (v14+) and npm
- MetaMask browser extension
- Hardhat for smart contract development

### Smart Contract Deployment

1. Install dependencies:
   ```
   npm install
   ```

2. Compile the contract:
   ```
   npx hardhat compile
   ```

3. Start a local Hardhat node (for testing):
   ```
   npx hardhat node
   ```

4. Deploy the contract to the local network:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. Note the deployed contract address and update it in the frontend code (`frontend/src/App.jsx`).

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the `CONTRACT_ADDRESS` in `src/App.jsx` with your deployed contract address.

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to the provided URL (usually http://localhost:5173).

## Deploying to a Public Network

To deploy to a public network like Ethereum Mainnet or Polygon:

1. Create a `.env` file based on `.env.example` with your private key and API keys:
   ```
   PRIVATE_KEY=your_private_key
   ALCHEMY_API_KEY=your_alchemy_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. Deploy using:
   ```
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

   Available networks:
   - `mainnet` - Ethereum mainnet
   - `sepolia` - Ethereum Sepolia testnet
   - `polygon` - Polygon mainnet
   - `polygon_mumbai` - Polygon Mumbai testnet

3. Update the `CONTRACT_ADDRESS` in the frontend code with the new address.

## Deploying the Frontend

### Building for Production

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. The build files will be in the `frontend/dist` directory, ready for deployment.

### Baremetal Server Deployment

To deploy on a baremetal server with Nginx:

1. Build the frontend as described above.

2. Copy the build files to your server:
   ```
   rsync -avz frontend/dist/ user@your-server:/var/www/imran-khan-vote/
   ```

3. Configure Nginx to serve the files:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/imran-khan-vote;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. Restart Nginx:
   ```
   sudo systemctl restart nginx
   ```

## Unstoppable Domain Integration

This application supports Unstoppable Domains for censorship-resistant access:

### Setting Up Unstoppable Domain

1. Purchase an Unstoppable Domain (e.g., `yourdomain.unstoppable`).

2. Create a redirect HTML file:
   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>Redirecting</title>
       <meta http-equiv="refresh" content="1; url=http://your-server-ip" />
     </head>
     <body>
       <p>Redirecting...</p>
     </body>
   </html>
   ```

3. Upload this file (named `index.html`) to your Unstoppable Domain through their dashboard.

4. Users can now access your application via:
   - Direct domain: `yourdomain.unstoppable` (in compatible browsers)
   - Gateway: `https://yourdomain.unstoppable.link`

## User Access Guide

A comprehensive guide for users to access the application via Unstoppable Domains is available at `/unstoppable-domain-guide.html` on the deployed site.

## Election Facts

The application includes factual information about the February 8, 2024 Pakistani elections:

- Imran Khan's party (PTI) won over 180 seats in the National Assembly
- The election results were manipulated through Form 47 alterations
- International observers acknowledged the electoral fraud
- Imran Khan remains imprisoned on politically motivated charges

## Development

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/imran-khan-vote.git
   cd imran-khan-vote
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   ```

3. Start the local development environment:
   ```
   # In one terminal (for the blockchain)
   npx hardhat node
   
   # In another terminal (for contract deployment)
   npx hardhat run scripts/deploy.js --network localhost
   
   # In a third terminal (for the frontend)
   cd frontend && npm run dev
   ```

### Testing

Run the test suite with:
```
npx hardhat test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgements

- Ethereum Foundation
- Unstoppable Domains
- The people of Pakistan who continue to fight for democracy
