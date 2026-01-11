/**
 * Init command - Start conversational website building
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { input, select, checkbox, confirm } from '@inquirer/prompts';
import { ConversationEngine } from '../conversation/engine.js';
import { INDUSTRY_LIST, INDUSTRIES } from '@siteforge/shared';
import type { IndustryType, PartialBusinessInfo, BusinessInfo } from '@siteforge/shared';

export const initCommand = new Command('init')
  .description('Initialize a new website project through conversation')
  .argument('[name]', 'Project name')
  .option('-i, --industry <type>', 'Pre-select industry type')
  .option('-o, --output <dir>', 'Output directory')
  .option('--dry-run', 'Show plan without generating files')
  .action(async (name, options) => {
    try {
      console.log(chalk.cyan('\nLet\'s build your website! I\'ll ask you some questions about your business.\n'));
      console.log(chalk.gray('━'.repeat(60) + '\n'));

      // Phase 1: Basic Information
      console.log(chalk.bold.white('📋 BASIC INFORMATION\n'));

      const businessName = name || await input({
        message: 'What is your business name?',
        validate: (value) => value.length > 0 || 'Business name is required',
      });

      const industry = (options.industry as IndustryType) || await select({
        message: 'What industry are you in?',
        choices: INDUSTRY_LIST.map((id) => ({
          name: INDUSTRIES[id].name,
          value: id,
        })),
      });

      const description = await input({
        message: 'Describe your business in a few sentences:',
        validate: (value) => value.length > 10 || 'Please provide a brief description',
      });

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Phase 2: Contact Information
      console.log(chalk.bold.white('📞 CONTACT INFORMATION\n'));

      const phone = await input({
        message: 'Primary phone number:',
        validate: (value) => {
          const cleaned = value.replace(/\D/g, '');
          return cleaned.length >= 10 || 'Please enter a valid phone number';
        },
      });

      const email = await input({
        message: 'Business email:',
        validate: (value) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email';
        },
      });

      const city = await input({
        message: 'Primary city:',
        validate: (value) => value.length > 0 || 'City is required',
      });

      const state = await input({
        message: 'State (e.g., NC, TX):',
        validate: (value) => value.length === 2 || 'Please enter 2-letter state code',
      });

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Phase 3: Services
      console.log(chalk.bold.white('🔧 SERVICES\n'));

      const servicesInput = await input({
        message: 'What services do you offer? (comma-separated):',
        validate: (value) => value.length > 0 || 'At least one service is required',
      });

      const services = servicesInput.split(',').map((s) => s.trim()).filter(Boolean);

      const yearsInBusiness = await input({
        message: 'Years in business (optional, press Enter to skip):',
        default: '',
      });

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Phase 4: Service Areas
      console.log(chalk.bold.white('📍 SERVICE AREAS\n'));

      const serviceAreasInput = await input({
        message: 'What cities/areas do you serve? (comma-separated):',
        default: city,
      });

      const serviceAreas = serviceAreasInput.split(',').map((s) => s.trim()).filter(Boolean);

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Phase 5: Social Proof
      console.log(chalk.bold.white('⭐ SOCIAL PROOF\n'));

      const googleProfile = await input({
        message: 'Google Business profile URL (optional, press Enter to skip):',
        default: '',
      });

      const reviewCount = await input({
        message: 'Approximate number of reviews:',
        default: '0',
      });

      const rating = await input({
        message: 'Average rating (e.g., 4.8):',
        default: '5.0',
      });

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Phase 6: Branding
      console.log(chalk.bold.white('🎨 BRANDING\n'));

      const tone = await select({
        message: 'What tone should your website have?',
        choices: [
          { name: 'Professional / Corporate', value: 'professional' },
          { name: 'Friendly / Approachable', value: 'friendly' },
          { name: 'Premium / Luxury', value: 'premium' },
          { name: 'Family-owned / Local', value: 'family-owned' },
          { name: 'Technical / Expert', value: 'technical' },
        ],
      });

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Build BusinessInfo object
      const businessInfo: BusinessInfo = {
        name: businessName,
        description,
        industry: industry as IndustryType,
        phone,
        email,
        addresses: [{
          city,
          state: state.toUpperCase(),
          stateAbbr: state.toUpperCase(),
          zip: '',
          type: 'primary',
        }],
        services: services.map((name, index) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          isPrimary: index === 0,
        })),
        serviceAreas: serviceAreas.map((cityName, index) => ({
          city: cityName,
          state: state.toUpperCase(),
          stateAbbr: state.toUpperCase(),
          priority: index === 0 ? 'high' : 'medium',
        })),
        yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
        social: {},
        googleBusinessProfile: googleProfile || undefined,
        reviews: parseFloat(rating) > 0 ? [{
          platform: 'google',
          rating: parseFloat(rating),
          count: parseInt(reviewCount) || 0,
        }] : [],
        certifications: [],
        licenses: [],
        insurance: [],
        warranties: [],
        valueProps: [],
        awards: [],
        tone: tone as BusinessInfo['tone'],
      };

      // Confirmation
      console.log(chalk.bold.white('✅ CONFIRMATION\n'));

      console.log(chalk.white('I\'ll create your website with:'));
      console.log(chalk.gray(`• ${services.length} service page${services.length > 1 ? 's' : ''} (${services.join(', ')})`));
      console.log(chalk.gray(`• ${serviceAreas.length} city/location page${serviceAreas.length > 1 ? 's' : ''} (${serviceAreas.join(', ')})`));
      console.log(chalk.gray('• Professional homepage with your services highlighted'));
      console.log(chalk.gray('• About page featuring your experience'));
      console.log(chalk.gray('• Contact page with integrated form'));
      console.log(chalk.gray('• SEO-optimized throughout'));
      console.log(chalk.gray('• Mobile-responsive design\n'));

      // Cost estimate
      const estimatedCost = '$0.20 - $0.30';
      console.log(chalk.yellow(`Estimated generation cost: ${estimatedCost} (Claude + Groq)\n`));

      if (options.dryRun) {
        console.log(chalk.cyan('\n[Dry run] Would generate project here.\n'));
        console.log(chalk.gray('Business Info:'));
        console.log(JSON.stringify(businessInfo, null, 2));
        return;
      }

      const proceed = await confirm({
        message: 'Proceed with generation?',
        default: true,
      });

      if (!proceed) {
        console.log(chalk.yellow('\nGeneration cancelled.\n'));
        return;
      }

      console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));

      // Start generation
      console.log(chalk.bold.cyan('🔄 GENERATING YOUR WEBSITE\n'));

      const spinner = ora('Initializing...').start();

      try {
        // Check for API keys
        if (!process.env.ANTHROPIC_API_KEY) {
          spinner.fail('ANTHROPIC_API_KEY not found in environment');
          console.log(chalk.yellow('\nPlease set your API keys:'));
          console.log(chalk.gray('  export ANTHROPIC_API_KEY=sk-ant-...'));
          console.log(chalk.gray('  export GROQ_API_KEY=gsk_...'));
          return;
        }

        if (!process.env.GROQ_API_KEY) {
          spinner.fail('GROQ_API_KEY not found in environment');
          console.log(chalk.yellow('\nPlease set your API keys:'));
          console.log(chalk.gray('  export ANTHROPIC_API_KEY=sk-ant-...'));
          console.log(chalk.gray('  export GROQ_API_KEY=gsk_...'));
          return;
        }

        // Initialize conversation engine
        const engine = new ConversationEngine();

        // Phase 1: Research
        spinner.text = 'Researching industry context...';
        await engine.research(businessInfo);
        spinner.succeed('Research complete');

        // Phase 2: Planning
        spinner.start('Planning site architecture...');
        await engine.plan(businessInfo);
        spinner.succeed('Architecture planned');

        // Phase 3: Content Generation
        spinner.start('Generating marketing content...');
        const siteConfig = await engine.generateContent(businessInfo);
        spinner.succeed('Content generated');

        // Phase 4: Code Generation
        spinner.start('Generating code and components...');
        const outputDir = options.output || `./${businessName.toLowerCase().replace(/\s+/g, '-')}`;
        await engine.generateCode(siteConfig, outputDir);
        spinner.succeed('Code generated');

        // Phase 5: Validation
        spinner.start('Validating output...');
        await engine.validate(outputDir);
        spinner.succeed('Validation complete');

        // Final output
        console.log(chalk.gray('\n' + '━'.repeat(60) + '\n'));
        console.log(chalk.bold.green('✅ GENERATION COMPLETE!\n'));

        const stats = engine.getStats();
        console.log(chalk.white(`📁 Output: ${outputDir}`));
        console.log(chalk.white(`📄 Files: ${stats.totalFiles} total`));
        console.log(chalk.white(`💰 Cost: $${stats.totalCost.toFixed(4)}`));
        console.log(chalk.white(`⏱️  Time: ${(stats.durationMs / 1000).toFixed(1)}s\n`));

        console.log(chalk.cyan('Next steps:'));
        console.log(chalk.gray(`  cd ${outputDir}`));
        console.log(chalk.gray('  npm install'));
        console.log(chalk.gray('  npm run dev\n'));

        console.log(chalk.gray(`Your site will be available at ${chalk.cyan('http://localhost:3000')}\n`));

      } catch (error) {
        spinner.fail('Generation failed');
        console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
      }

    } catch (error) {
      if (error instanceof Error && error.message.includes('User force closed')) {
        console.log(chalk.yellow('\n\nGeneration cancelled.\n'));
      } else {
        console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
      }
    }
  });
