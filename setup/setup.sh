#!/bin/bash

# Check for root
if [[ "$EUID" = "0" ]]; then
   echo "This script must NOT be run as root"
   exit 1
fi

# Get Script Directory
SCRIPT_DIR=$(dirname "$0")

# UPDATE
sudo apt update -y
sudo sudo apt upgrade -y
sudo apt dist-upgrade -y
sudo apt autoremove -y

# Temporary Directory
cd /tmp
mkdir softwares
cd softwares

# Software Properties (ppa)
sudo apt install software-properties-common -y

# Enable Click to Minimize
# Don't know if this is that useful, because it sure gets annoying at times (esp. on multi-monitors)
gsettings set org.compiz.unityshell:/org/compiz/profiles/unity/plugins/unityshell/ launcher-minimize-window true

# Enable recursive search in file browser
gsettings set org.gnome.nautilus.preferences enable-interactive-search false

# Show Mounted Devices On Desktop
gsettings set org.gnome.nautilus.desktop volumes-visible true

# Install Restricted Extras (Like MP3 Codecs & all)
# sudo apt install -y ubuntu-restricted-extras

# Install Additional Codecs
# sudo apt install -y ffmpeg gxine libdvdread4 icedax tagtool libdvd-pkg easytag id3tool lame libxine2-ffmpeg nautilus-script-audio-convert libmad0 mpg321 libavcodec-extra gstreamer1.0-libav

# Install Laptop Power Management (Not Necessary I Think => This is a laptop power saving package)
# sudo apt install -y laptop-mode-tools

# Install Unity Tweak Tool
sudo apt install -y unity-tweak-tool

# Install Roboto, Lato & Hack Fonts
sudo apt install -y fonts-roboto fonts-lato fonts-hack-ttf

# Install Adapta Theme
sudo apt-add-repository -y ppa:tista/adapta
sudo apt update
sudo apt install -y adapta-gtk-theme

# Install Paper Theme
sudo add-apt-repository -y ppa:snwh/pulp
sudo apt update -y
# sudo apt install -y paper-gtk-theme
sudo apt install -y paper-icon-theme
# sudo apt install -y paper-cursor-theme

# Install Arc Theme
# sudo add-apt-repository -y ppa:noobslab/themes
# sudo apt update -y
# sudo apt install -y arc-theme
# sudo add-apt-repository -y ppa:noobslab/icons
# sudo apt update -y
# sudo apt install -y arc-icons

# Install Papirus Icons
# sudo add-apt-repository -y ppa:varlesh-l/papirus-pack
# sudo apt update -y
# sudo apt install -y papirus-gtk-icon-theme

# Enable Paper Theme
gsettings set org.gnome.desktop.wm.preferences theme 'Adapta'
gsettings set org.gnome.desktop.interface icon-theme 'Paper'
gsettings set org.gnome.desktop.interface gtk-theme 'Adapta'
# gsettings set org.gnome.desktop.interface cursor-theme 'Paper'

# Remove Amazon App
cp /usr/share/applications/ubuntu-amazon-default.desktop ~/.local/share/applications/ubuntu-amazon-default.desktop
echo Hidden=true >> ~/.local/share/applications/ubuntu-amazon-default.desktop
sudo rm -rf /usr/share/applications/ubuntu-amazon-default.desktop

# Install Albert
sudo add-apt-repository ppa:nilarimogard/webupd8 -y
sudo apt update -y
sudo apt install albert -y

# Install wmctrl
sudo apt install wmctrl -y

# Enable Tap To Click
gsettings set org.gnome.desktop.peripherals.touchpad tap-to-click true

# Chrome
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list'
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo apt update -y
sudo apt install -y google-chrome-beta  # Or google-chrome-stable / google-chrome-canary

# WPS Office
wget http://kdl.cc.ksosoft.com/wps-community/download/a21/wps-office_10.1.0.5672~a21_amd64.deb
sudo apt install -y ./wps-office_10.1.0.5672~a21_amd64.deb

# Haroopad
wget https://bitbucket.org/rhiokim/haroopad-download/downloads/haroopad-v0.13.1-x64.deb
sudo apt install -y ./haroopad-v0.13.1-x64.deb
sudo sed -i 's/^Exec.*$/Exec=haroopad %f/g' /usr/share/applications/Haroopad.desktop

# Atom (Not Needed Currently)
sudo add-apt-repository ppa:webupd8team/atom -y
sudo apt update -y
sudo apt install atom -y

# Install Atom Packages
apm install minimap pigments todo-show split-diff markdown-preview-enhanced linter last-cursor-position language-vue language-postcss highlight-selected git-time-machine git-plus file-icons emmet editorconfig docblockr autocomplete-modules autoclose-html autodetect-indentation atom-ternjs merge-conflicts git-blame language-graphql-lb language-babel minimap-split-diff minimap-find-and-replace minimap-linter minimap-highlight-selected linter-eslint

# Install VSCode
wget https://go.microsoft.com/fwlink/?LinkID=760868 -O vscode.deb
sudo apt install -y ./vscode.deb

# Sublime Text
sudo add-apt-repository ppa:webupd8team/sublime-text-3 -y
sudo apt update -y
sudo apt install sublime-text-installer -y
sudo sed -i "127.0.0.1  www.sublimetext.com" /etc/hosts
sudo sed -i "127.0.0.1  sublimetext.com" /etc/hosts

# Install Sublime Package Control
mkdir -p ~/".config/sublime-text-3/Installed Packages/"
mkdir -p ~/".config/sublime-text-3/Packages/User/"
wget https://packagecontrol.io/Package%20Control.sublime-package
mv "Package Control.sublime-package" ~/".config/sublime-text-3/Installed Packages/"

# Copy Sublime Config
cp "$SCRIPT_DIR/Package Control.sublime-settings" ~/".config/sublime-text-3/Packages/User/Package Control.sublime-settings"
cp "$SCRIPT_DIR/Preferences.sublime-settings" ~/".config/sublime-text-3/Packages/User/Preferences.sublime-settings"

# VLC
sudo apt install vlc -y

# Shutter (Screenshot Tool)
sudo apt install shutter -y

# KolourPaint (MS Paint Clone)
# sudo apt install kolourpaint4 -y

# Pinta (Paint Tool)
# sudo apt install pinta -y

# Install Terminator
sudo apt install -y terminator

# Copy Terminator Config
mkdir -p ~/.config/terminator
cp "$SCRIPT_DIR/terminator.config" ~/.config/terminator/config

# Install Ansible
sudo add-apt-repository ppa:ansible/ansible -y
sudo apt update -y
sudo apt install ansible -y

# Add Items To Dock
gsettings set com.canonical.Unity.Launcher favorites "['application://ubiquity.desktop', 'application://org.gnome.Nautilus.desktop', 'application://google-chrome-beta.desktop', 'application://firefox.desktop', 'application://terminator.desktop', 'application://sublime-text.desktop', 'unity://running-apps', 'unity://expo-icon', 'unity://devices']"

# Remove Libreoffice
sudo apt purge -y libreoffice*
sudo apt autoclean -y
sudo apt autoremove -y

# Install ZSH
sudo apt install zsh -y
chsh -s /usr/bin/zsh

# Modify Hosts File
sudo sh -c 'echo "127.0.0.1  db.lc" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1  sm.lc" >> /etc/hosts'

# MANUAL ITEMS
# Set Albert Hot Key To Ctrl+Alt+Space OR Super+Space

# Reboot
# sudo reboot
