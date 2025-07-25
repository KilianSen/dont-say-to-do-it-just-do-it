import {useEffect, useState} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {ModeToggle} from "@/components/ui/theme-toggle.tsx";

type Example = {
	title: string
	severity?: 'low' | 'medium' | 'high'
	subtitle?: string
	timeframe: string
	badge: string
	content: string
}

function App() {
	const [examples, setExamples] = useState<Example[]>([] as Example[])
	const [terms, setTerms] = useState("")
	const [termsAccept, setTermsAccept] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [storyForm, setStoryForm] = useState({
		title: '',
		subtitle: '',
		timeframe: '',
		severity: 'medium' as 'low' | 'medium' | 'high',
		badge: '',
		content: ''
	})

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut"
			}
		}
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut"
			}
		},
		hover: {
			y: -5,
			scale: 1.02,
			transition: {
				duration: 0.2,
				ease: "easeInOut"
			}
		}
	}

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2
			}
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/data.json');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const jsonData = await response.json();
				if (Array.isArray(jsonData)) {
					setExamples(jsonData);
				} else {
					console.error('Invalid JSON format: Expected an array');
					toast.error('Failed to load stories - invalid format');
				}
			} catch (error) {
				console.error('Error fetching JSON:', error);
				toast.error('Failed to load stories. Please refresh the page.');
			}
		};
		fetchData().then();
	}, []);

	useEffect(() => {
		const fetchTerms = async () => {
			try {
				const response = await fetch('/terms.md');
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const text = await response.text();
				setTerms(text);
			} catch (error) {
				console.error('Error fetching terms:', error);
				toast.error('Failed to load terms and conditions');
			}
		};
		fetchTerms().then();
	}, []);

	// Copy to clipboard function with toast feedback
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(`https://${window.location.hostname}/`);
			toast.success('URL copied to clipboard! 📋', {
				duration: 2000,
				icon: '🎉',
			});
		} catch (err) {
			console.error('Failed to copy: ', err);
			toast.error('Failed to copy URL. Please try again.');
		}
	};

	const handleStorySubmit = async () => {
		const { title, subtitle, timeframe, severity, badge, content } = storyForm;

		// Enhanced validation with toast feedback
		if (!title.trim()) {
			toast.error('Please enter a story title');
			return;
		}

		if (!content.trim()) {
			toast.error('Please enter your story content');
			return;
		}

		if (!termsAccept) {
			toast.error('Please accept the terms and conditions');
			return;
		}

		setIsSubmitting(true);

		try {
			// Create the JSON object for data.json
			const storyData = {
				title: title.trim(),
				...(subtitle?.trim() && { subtitle: subtitle.trim() }),
				timeframe: timeframe.trim(),
				...(severity && { severity }),
				badge: badge.trim(),
				content: content.trim()
			};

			// Generate GitHub issue body with formatted JSON
			const issueBody = `## New Story Submission

**Story Data for data.json:**

\`\`\`json
${JSON.stringify(storyData, null, 2)}
\`\`\`

**Instructions:**
Please review this story submission and add it to the \`public/data.json\` file if appropriate.

**Preview:**
- **Title:** ${title}
- **Subtitle:** ${subtitle || 'N/A'}
- **Timeframe:** ${timeframe || 'N/A'}
- **Severity:** ${severity}
- **Badge:** ${badge || 'N/A'}

**Story Content:**
${content}`;

			const issueTitle = encodeURIComponent(`New Story: ${title.trim()}`);
			const issueBodyEncoded = encodeURIComponent(issueBody);

			// You'll need to replace this with your actual GitHub repository URL

			const githubRepo = 'KilianSen/dont-say-to-do-it-just-do-it';
			const url = `https://github.com/${githubRepo}/issues/new?title=${issueTitle}&body=${issueBodyEncoded}&labels=story-submission`;

			// Show success message before opening
			toast.success('Opening GitHub to create your story submission!', {
				duration: 3000,
				icon: '🚀',
			});

			// Small delay to show the toast before opening GitHub
			await new Promise(resolve => setTimeout(resolve, 500));

			// Open GitHub in a new tab
			window.open(url, '_blank');

			// Reset the form after successful submission
			setStoryForm({
				title: '',
				subtitle: '',
				timeframe: '',
				severity: 'medium',
				badge: '',
				content: ''
			});

			setTermsAccept(false);

			toast.success('Form reset! Thank you for your submission 🙏', {
				duration: 2000,
			});

		} catch (error) {
			console.error('Submission error:', error);
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<motion.div
			className="min-h-screen bg-background"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<div className={"relative bottom-4 right-4"}>
				<div className="fixed bottom-4 right-4 z-50">
					<ModeToggle/>
				</div>
			</div>
			<div className="max-w-5xl mx-auto p-6 space-y-8">
				{/* Header Section */}
				<motion.div
					className="text-center space-y-6 py-12"
					// @ts-expect-error ignore
					variants={itemVariants}
				>
					<div className="space-y-4">
						<motion.h1
							className="text-4xl pb-3 md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
							initial={{ opacity: 0, y: -30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							Don't say to do it, just do it.
						</motion.h1>
						<motion.p
							className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							Stop endless conversations. Start building solutions. 🚀
						</motion.p>
					</div>

					<motion.div
						className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<span>Inspired by</span>
						<motion.a
							href="https://dontasktoask.com/"
							className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors font-medium"
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							📝 Don't ask to ask, just ask
						</motion.a>
					</motion.div>
				</motion.div>

				{/* Quick Stats */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					<motion.div
						// @ts-expect-error ignore
						variants={cardVariants} whileHover="hover">
						<Card className="text-center p-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 h-full">
							<motion.div
								className="text-3xl mb-2"
								animate={{ rotate: [0, -10, 10, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
							>
								💬
							</motion.div>
							<h3 className="font-semibold text-blue-800 dark:text-blue-200">Too Much Talk</h3>
							<p className="text-sm text-blue-600 dark:text-blue-300 mt-2">Endless meetings, no outcomes</p>
						</Card>
					</motion.div>
					<motion.div
						// @ts-expect-error ignore
						variants={cardVariants} whileHover="hover">
						<Card className="text-center p-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 h-full">
							<motion.div
								className="text-3xl mb-2"
								animate={{ rotate: 360 }}
								transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
							>
								⏰
							</motion.div>
							<h3 className="font-semibold text-orange-800 dark:text-orange-200">Wasted Time</h3>
							<p className="text-sm text-orange-600 dark:text-orange-300 mt-2">Hours spent discussing, not doing</p>
						</Card>
					</motion.div>
					// @ts-expect-error ignore
					<motion.div
						// @ts-expect-error ignore
						variants={cardVariants} whileHover="hover">
						<Card className="text-center p-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 h-full">
							<motion.div
								className="text-3xl mb-2"
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
							>
								✅
							</motion.div>
							<h3 className="font-semibold text-green-800 dark:text-green-200">The Solution</h3>
							<p className="text-sm text-green-600 dark:text-green-300 mt-2">Action over conversation</p>
						</Card>
					</motion.div>
				</motion.div>

				{/* Problem Statement */}
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
				>
					<Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
						<CardHeader>
							<CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
								<motion.span
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
								>
									🔥
								</motion.span>
								Sound familiar?
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<motion.div
									className="space-y-3"
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.2 }}
								>
									<h4 className="font-semibold text-red-700 dark:text-red-300">What you hear daily:</h4>
									<ul className="space-y-2 text-sm">
										{[
											"We should really refactor this codebase",
											"Someone needs to update the docs",
											"We need better testing coverage",
											"This feature would be so useful!"
										].map((text, index) => (
											<motion.li
												key={index}
												className="flex items-center gap-2"
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true }}
												transition={{ duration: 0.3, delay: index * 0.1 }}
											>
												<span className="text-red-500">💭</span>
												"{text}"
											</motion.li>
										))}
									</ul>
								</motion.div>
								<motion.div
									className="space-y-3"
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.4 }}
								>
									<h4 className="font-semibold text-red-700 dark:text-red-300">What actually happens:</h4>
									<ul className="space-y-2 text-sm">
										{[
											"Endless discussions that go nowhere",
											"You end up doing their \"suggestions\"",
											"Projects stall while they \"plan\"",
											"Deadlines missed, frustration high"
										].map((text, index) => (
											<motion.li
												key={index}
												className="flex items-center gap-2"
												initial={{ opacity: 0, x: 10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true }}
												transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
											>
												<span className="text-red-500">😤</span>
												{text}
											</motion.li>
										))}
									</ul>
								</motion.div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Solution */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
				>
					<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<motion.div
									className="text-4xl"
									animate={{
										scale: [1, 1.2, 1],
										rotate: [0, 5, -5, 0]
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										repeatDelay: 3
									}}
								>
									💡
								</motion.div>
								<h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
									The Simple Solution
								</h3>
								<p className="text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
									<strong>Just send them this link.</strong> Help them understand that action beats endless planning.
									Sometimes people need a gentle nudge to start building instead of just talking.
								</p>
								<motion.div
									className="bg-white dark:bg-gray-900/50 p-4 rounded-lg max-w-md mx-auto cursor-pointer border-2 border-transparent hover:border-green-300 transition-colors"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={copyToClipboard}
								>
									<code className="text-sm text-green-600 dark:text-green-400 break-all">
										https://{window.location.hostname}/
									</code>
									<motion.p
										className="text-xs text-green-500 mt-1"
										initial={{ opacity: 0 }}
										whileHover={{ opacity: 1 }}
									>
										Click to copy
									</motion.p>
								</motion.div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<Separator />

				<div className="space-y-6">
					<h2 className="text-3xl font-bold text-center">Hey, you! 👋</h2>
					<Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
						<CardHeader>
							<CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
								🎯 So someone sent you here...
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-lg">
								Don't take it personally! Someone cares enough about you (and the project) to help you become more effective.
								This isn't about being mean—it's about <strong>getting things done together</strong>.
							</p>

							<div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border-l-4 border-primary">
								<p className="font-medium text-primary mb-2">The reality check:</p>
								<p>You might be stuck in "planning mode" when the team needs you in "doing mode."
								It happens to the best of us! ���‍♀️</p>
							</div>
						</CardContent>
					</Card>

					<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
						<CardHeader>
							<CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
								⚡ Time to level up
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-3">
									<h4 className="font-semibold text-green-700 dark:text-green-300">Instead of saying:</h4>
									<ul className="space-y-2 text-sm text-muted-foreground">
										<li>❌ "We should refactor this"</li>
										<li>�� "Someone needs to fix this bug"</li>
										<li>❌ "We need better documentation"</li>
										<li>❌ "This feature would be nice"</li>
									</ul>
								</div>
								<div className="space-y-3">
									<h4 className="font-semibold text-green-700 dark:text-green-300">Try doing:</h4>
									<ul className="space-y-2 text-sm">
										<li>✅ Create a refactoring PR</li>
										<li>✅ Fix the bug and submit it</li>
										<li>✅ Write the docs yourself</li>
										<li>✅ Build a prototype or create an issue</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
						<CardHeader>
							<CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
								🚀 Your action plan
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid gap-4 md:grid-cols-3">
								<div className="text-center p-4 bg-white dark:bg-gray-900/50 rounded-lg">
									<div className="text-2xl mb-2">🎯</div>
									<h4 className="font-semibold mb-1">Start Small</h4>
									<p className="text-sm text-muted-foreground">Pick one thing you mentioned and just do it today</p>
								</div>
								<div className="text-center p-4 bg-white dark:bg-gray-900/50 rounded-lg">
									<div className="text-2xl mb-2">⏰</div>
									<h4 className="font-semibold mb-1">Time Box It</h4>
									<p className="text-sm text-muted-foreground">Give yourself 2 hours max for the first attempt</p>
								</div>
								<div className="text-center p-4 bg-white dark:bg-gray-900/50 rounded-lg">
									<div className="text-2xl mb-2">🎉</div>
									<h4 className="font-semibold mb-1">Share Progress</h4>
									<p className="text-sm text-muted-foreground">Show what you built, even if it's imperfect</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30">
						<CardHeader>
							<CardTitle className="text-purple-800 dark:text-purple-200 text-lg">
								💜 Remember: Your team believes in you
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-center italic">
								The person who sent you here sees your potential. They want you to succeed, not fail.
								Channel that talking energy into building energy—you've got this! 🙌
							</p>
						</CardContent>
					</Card>
				</div>

				<Separator />

				{/* Examples Section */}
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<motion.h2
						className="text-3xl font-bold text-center"
						initial={{ opacity: 0, y: -20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						Stories
					</motion.h2>
					<motion.div
						className="grid gap-6"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{examples.map((example, index) => {
							const severityClass = example.severity === 'low' ? 'bg-green-400!' : (example.severity === 'medium' ? 'bg-orange-400!' : 'bg-red-400!');

							return (
								<motion.div
									key={index}
									// @ts-expect-error ignore
									variants={cardVariants}
									whileHover="hover"
								>
									<Card className="relative overflow-hidden">
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between gap-2">
												<CardTitle className="text-xl grow">{example.title}</CardTitle>
												<motion.div
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													<Badge variant="destructive" className={severityClass}>
														{example.timeframe}
													</Badge>
												</motion.div>
												<motion.div
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													<Badge variant="destructive" className={severityClass}>
														{example.badge}
													</Badge>
												</motion.div>
											</div>
											<CardDescription>
												{example.subtitle}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-x-auto">
												<Markdown remarkPlugins={[remarkGfm]}>
													{example.content}
												</Markdown>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				</motion.div>

				<Separator />

				{/* Story Submission */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								📝 Share Your Story
							</CardTitle>
							<CardDescription>
								Have a similar experience? Fill out the form below and we'll generate a GitHub issue with all the data needed to add your story to our examples.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Story Title *</label>
									<motion.input
										type="text"
										className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
										placeholder="e.g., The Feature Suggester"
										value={storyForm.title}
										onChange={(e) => setStoryForm({...storyForm, title: e.target.value})}
										whileFocus={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Badge</label>
									<motion.input
										type="text"
										className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
										placeholder="e.g., Ghost Mode, Vanishing Act"
										value={storyForm.badge}
										onChange={(e) => setStoryForm({...storyForm, badge: e.target.value})}
										whileFocus={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Timeframe</label>
									<motion.input
										type="text"
										className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
										placeholder="e.g., 3 weeks, 2 days before deadline"
										value={storyForm.timeframe}
										onChange={(e) => setStoryForm({...storyForm, timeframe: e.target.value})}
										whileFocus={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Severity</label>
									<motion.select
										className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
										value={storyForm.severity}
										onChange={(e) => setStoryForm({...storyForm, severity: e.target.value as 'low' | 'medium' | 'high'})}
										whileFocus={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
									>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</motion.select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Subtitle (optional)</label>
								<motion.input
									type="text"
									className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
									placeholder="Brief description or context"
									value={storyForm.subtitle}
									onChange={(e) => setStoryForm({...storyForm, subtitle: e.target.value})}
									whileFocus={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Your Story *</label>
								<motion.div
									whileFocus={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}
								>
									<Textarea
										placeholder="Tell us about your experience with coworkers who love to talk but never actually do the work..."
										className="min-h-[120px] resize-none"
										value={storyForm.content}
										onChange={(e) => setStoryForm({...storyForm, content: e.target.value})}
									/>
								</motion.div>
							</div>

							<div className="flex items-center justify-between select-none">
								<div className="flex items-center space-x-2">
									<Checkbox id={"accept"} required={true} checked={termsAccept} onCheckedChange={(checked) => setTermsAccept(!!checked)} />
									<label htmlFor={"accept"}
									       className="text-sm text-muted-foreground ml-2">
										I confirm that I want to submit this story and it is appropriate for the site.*
										<Dialog>
											<DialogTrigger>
												<p className={"text-blue-500 ml-2"}>Terms</p>
											</DialogTrigger>
											<DialogContent aria-describedby="terms">
												<DialogTitle>Terms</DialogTitle>
													<Markdown remarkPlugins={[remarkGfm]}>
														{terms || "Loading terms..."}
													</Markdown>
											</DialogContent>
										</Dialog>
									</label>
								</div>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										disabled={!storyForm.title || !storyForm.content || !termsAccept}
										onClick={handleStorySubmit}
									>
										{isSubmitting ? 'Submitting...' : 'Create GitHub Issue'}
									</Button>
								</motion.div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Footer */}
				<motion.div
					className="text-center text-sm text-muted-foreground pt-8"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<p>Remember: Actions speak louder than words. 💪</p>
				</motion.div>

				<Toaster />
			</div>
		</motion.div>
	)
}

export default App
