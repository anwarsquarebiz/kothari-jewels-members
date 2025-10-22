import { Head, Link } from '@inertiajs/react'
import Navbar from '@/components/aftab-components/Navbar'
import Footer from '@/components/aftab-components/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Award, Shield } from 'lucide-react'

interface Props {
    title: string
    description: string
}

export default function Home({ title, description }: Props) {
    return (
        <>
            <Head title="Home" />
            <Navbar />
            
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            {title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg" className="gap-2">
                                    Browse Collection
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Exquisite Craftsmanship</h3>
                            <p className="text-gray-600">
                                Each piece is meticulously crafted by master artisans with decades of experience
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                            <p className="text-gray-600">
                                We use only the finest materials and gemstones in all our jewelry collections
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Trusted Legacy</h3>
                            <p className="text-gray-600">
                                A heritage of trust and excellence passed down through generations
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="bg-primary text-white rounded-2xl p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Find Your Perfect Piece?
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            Explore our exclusive collection of handcrafted jewelry
                        </p>
                        <Link href="/products">
                            <Button size="lg" variant="secondary" className="gap-2">
                                View Products
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    )
}


