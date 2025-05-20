import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} WinTrust. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/faqs" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Preguntas Frecuentes
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
