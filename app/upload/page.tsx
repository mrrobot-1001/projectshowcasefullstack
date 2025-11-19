'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    track: '',
    github: '',
    demo: '',
  })

  const STEPS = [
    { number: 1, title: 'Basic Info', description: 'Project title and description' },
    { number: 2, title: 'Details', description: 'Track and team information' },
    { number: 3, title: 'Media', description: 'Upload images and links' },
    { number: 4, title: 'Review', description: 'Confirm and submit' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pb-16 md:pb-20">
        {/* Header */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-8 h-8 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold">Upload Project</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Share your amazing project with the community
          </p>
        </section>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex gap-2 md:gap-4">
            {STEPS.map((s) => (
              <div key={s.number} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    step >= s.number ? 'bg-primary' : 'bg-muted'
                  }`}
                />
                <p className="text-xs md:text-sm font-medium mt-2 text-center">
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <div className="soft-shadow bg-card rounded-3xl p-8 md:p-10">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                  <p className="text-muted-foreground">Tell us about your project</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    placeholder="e.g., AI Chat Assistant"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-12 rounded-xl text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe what your project does..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border/20 bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring text-base"
                    rows={5}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Project Details</h2>
                  <p className="text-muted-foreground">Select track and team</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Track</label>
                  <select
                    value={formData.track}
                    onChange={(e) =>
                      setFormData({ ...formData, track: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border/20 bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring text-base"
                  >
                    <option value="">Select a track</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Game Dev">Game Dev</option>
                    <option value="Design">Design</option>
                    <option value="IoT">IoT</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Team (Optional)</label>
                  <Input
                    placeholder="Enter your team code"
                    className="h-12 rounded-xl text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if you're submitting individually
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Media & Links</h2>
                  <p className="text-muted-foreground">Add images and project links</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thumbnail Image</label>
                  <div className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Drag and drop your image</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub Repository</label>
                  <Input
                    placeholder="https://github.com/username/project"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({ ...formData, github: e.target.value })
                    }
                    className="h-12 rounded-xl text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Live Demo Link</label>
                  <Input
                    placeholder="https://your-project.com"
                    value={formData.demo}
                    onChange={(e) =>
                      setFormData({ ...formData, demo: e.target.value })
                    }
                    className="h-12 rounded-xl text-base"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold">Review Your Project</h2>
                    <p className="text-muted-foreground mt-1">
                      Everything looks good? Submit your project!
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <p className="font-medium text-sm">Project Summary:</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Title:</span>{' '}
                      {formData.title}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Track:</span>{' '}
                      {formData.track}
                    </p>
                    <p className="text-muted-foreground line-clamp-2">
                      {formData.description}
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm">
                    I confirm that this project meets the community guidelines and
                    original work standards
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-border/20">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex-1 h-11 rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (step < 4) setStep(step + 1)
                }}
                className="flex-1 h-11 rounded-xl"
              >
                {step === 4 ? 'Submit Project' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
