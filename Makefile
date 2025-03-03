.PHONY: deploy

# Deploy the Angular application
deploy:
	@echo "Building Angular application..."
	cd personal-website && ng build --configuration production
	@echo "Copying files to web server directory..."
	sudo cp -r personal-website/dist/personal-website/browser/* /var/www/vivekpanchagnula.com/
	@echo "Deployment complete!"