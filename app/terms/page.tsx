import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones | WinTrust",
  description: "Términos y condiciones de uso de la plataforma WinTrust",
}

export default function TermsPage() {
  // Obtener la fecha actual formateada
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />

      <Card className="max-w-4xl mx-auto mt-8 p-6 md:p-8">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-center mb-6">TÉRMINOS Y CONDICIONES DE USO DE WINTRUST</h1>

          <p className="text-sm text-gray-500 mb-6 text-center">
            <strong>Fecha de actualización:</strong> {currentDate}
          </p>

          <p className="mb-6">
            Bienvenido a <strong>WinTrust</strong>, una mini app desarrollada para la plataforma World App. Al acceder y
            utilizar esta aplicación, usted acepta los siguientes Términos y Condiciones, que regulan el uso de la
            plataforma. Lea atentamente este documento antes de participar en cualquier sorteo.
          </p>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">1. Objeto de la aplicación</h3>
          <p className="mb-6">
            WinTrust permite a usuarios humanos verificados participar en sorteos de premios mediante la compra de
            números digitales utilizando el token WLD. La app está diseñada para garantizar transparencia, trazabilidad
            y seguridad en todo el proceso.
          </p>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">2. Requisitos para participar</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              El usuario debe estar verificado a través de World ID mediante Orb (verificación biométrica).
            </li>
            <li className="mb-2">
              Solo están permitidas personas físicas mayores de edad según la legislación del país en que se encuentren.
            </li>
            <li className="mb-2">
              El usuario puede adquirir uno o varios números por sorteo mientras haya disponibilidad.
            </li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">3. Funcionamiento de los sorteos</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Cada sorteo tiene un premio, una fecha de cierre y un límite de números disponibles.
            </li>
            <li className="mb-2">El usuario podrá elegir un número específico (si está libre) o uno aleatorio.</li>
            <li className="mb-2">
              Al finalizar el sorteo, si está configurado para tener un ganador obligatorio y el número sorteado no fue
              adquirido por ningún usuario, los números no vendidos se redistribuirán aleatoriamente entre los
              participantes existentes y se realizará un nuevo sorteo para garantizar un ganador efectivo.
            </li>
            <li className="mb-2">
              Si el sorteo es de tipo "premio acumulado", puede declararse vacante y el premio pasará a un sorteo
              futuro.
            </li>
            <li className="mb-2">El resultado es visible para todos los usuarios y queda registrado públicamente.</li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">4. Transparencia y verificación</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Cada participación queda registrada junto con el <code>nullifier_hash</code> generado por World ID,
              garantizando que cada entrada es única y está vinculada a una persona real.
            </li>
            <li className="mb-2">WinTrust no accede a datos personales, ni identifica directamente al usuario.</li>
            <li className="mb-2">
              La app cumple con las políticas de privacidad de World App, incluyendo los principios de consentimiento y
              minimización de datos.
            </li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">5. Restricciones y contenido no permitido</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              No está permitido usar la app para fines fraudulentos, automatizados o con identidades falsas.
            </li>
            <li className="mb-2">
              WinTrust no contiene ni permitirá contenidos ofensivos, sexuales, violentos, discriminatorios ni
              políticamente sensibles.
            </li>
            <li className="mb-2">
              Queda estrictamente prohibido cualquier uso que infrinja las directrices de contenido seguras de World App
              y las leyes locales.
            </li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">6. Entrega de premios</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Al finalizar el sorteo, WinTrust notificará al ganador y le hará llegar un formulario que deberá completar
              con sus datos para gestionar la entrega del premio.
            </li>
            <li className="mb-2">
              Los premios pueden ser físicos o digitales, según el caso, y serán entregados de acuerdo con los plazos y
              condiciones indicados en cada sorteo.
            </li>
            <li className="mb-2">
              Si por alguna razón el premio físico no puede ser entregado, se ofrecerá al ganador una recompensa en
              tokens USDC por el valor estimado del premio.
            </li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">7. Jurisdicción y cumplimiento legal</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              WinTrust cumple con la legislación vigente en todos los países donde está disponible, excepto donde la
              participación en sorteos o juegos de azar esté restringida por ley.
            </li>
            <li className="mb-2">
              La aplicación no está disponible en Estados Unidos, Canadá, Indonesia, Malasia, Tailandia ni Polonia,
              países donde no está permitido el uso de mini apps basadas en sorteos o azar.
            </li>
            <li className="mb-2">Cada sorteo puede estar sujeto a regulaciones específicas del país o región.</li>
            <li className="mb-2">La app puede ser retirada de regiones donde no sea legal operar.</li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">8. Soporte al usuario</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Los usuarios pueden comunicarse con nuestro equipo mediante el formulario de contacto dentro de la app.
            </li>
            <li className="mb-2">Las consultas o reclamos serán respondidas en un plazo máximo de 72 horas hábiles.</li>
          </ul>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-3">9. Cambios en los términos</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Estos términos pueden modificarse en cualquier momento. El uso continuo de la app implica la aceptación de
              las versiones futuras.
            </li>
          </ul>

          <hr className="my-6" />

          <p className="text-center mb-4">
            Para cualquier duda legal o soporte, por favor contactanos en:{" "}
            <a href="mailto:soporte@wintrust.site" className="text-primary hover:underline">
              soporte@wintrust.site
            </a>
          </p>

          <p className="text-center font-medium">Gracias por usar WinTrust.</p>
        </div>
      </Card>
    </div>
  )
}
