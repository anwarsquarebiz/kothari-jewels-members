import { Head, Link } from '@inertiajs/react'
import Navbar from '@/components/aftab-components/Navbar'
import Footer from '@/components/aftab-components/Footer'
import { Button } from '@/components/ui/button'
import { Users, Heart, Target, Gem } from 'lucide-react'

interface Props {
    title: string
    description: string
}

export default function About({ title, description }: Props) {
    return (
        <>
            <Head title="About Us" />
            <Navbar />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {title}
                            </h1>
                            <p className="text-xl text-gray-600">
                                {description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <div className="prose prose-lg max-w-none text-gray-600">
                            <p className="mb-4">
                                For generations, Kothari Jewels has been synonymous with excellence, tradition, 
                                and the finest craftsmanship in jewelry making. Our journey began decades ago with 
                                a simple vision: to create timeless pieces that capture the essence of beauty and elegance.
                            </p>
                            <p className="mb-4">
                                Today, we continue this legacy by combining traditional artisanal techniques with 
                                contemporary designs, ensuring that each piece tells its own unique story. Our master 
                                craftsmen pour their heart and soul into every creation, making each piece a work of art.
                            </p>
                            <p>
                                We take pride in our commitment to quality, authenticity, and customer satisfaction. 
                                Every piece that leaves our workshop carries with it the Kothari promise of excellence.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                    <Gem className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                                <p className="text-gray-600">
                                    We never compromise on the quality of materials and craftsmanship
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Passion</h3>
                                <p className="text-gray-600">
                                    Every piece is created with love and dedication to our art
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                                <p className="text-gray-600">
                                    We strive for perfection in every detail of our work
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Trust</h3>
                                <p className="text-gray-600">
                                    Building lasting relationships with our valued customers
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Experience the Kothari Difference
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Explore our collection and discover the perfect piece that speaks to you
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg">Browse Collection</Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline">Contact Us</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    )
}

