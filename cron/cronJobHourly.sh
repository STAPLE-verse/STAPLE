# Absolute path to the directory where your cronJob.mjs is located
SCRIPT_DIR="/var/www/html/STAPLE/cron"
# Change to the script's directory
cd "$SCRIPT_DIR" || exit
# Run the Node.js scriptnode cronJob.mjs
node cronJobFolderSize.mjs
node cronJobDeleteTmp.mjs
