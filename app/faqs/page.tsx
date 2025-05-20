import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | WinTrust",
  description: "Respuestas a las preguntas más comunes sobre WinTrust",
}

export default function FAQsPage() {
  const faqs = [
    {
      question: "¿Qué es WinTrust?",
      answer:
        "WinTrust es una mini app de sorteos digitales construida sobre World App. Te permite participar en sorteos verificados usando tu identidad World ID y pagar con tokens WLD.",
    },
    {
      question: "¿Cómo participo en un sorteo?",
      answer:
        "Primero debés verificar tu identidad mediante el Orb de Worldcoin. Luego, podés elegir un número específico o dejar que el sistema te asigne uno aleatoriamente. Pagá el valor correspondiente en WLD y listo, ya estás participando.",
    },
    {
      question: "¿Puedo comprar más de un número en un mismo sorteo?",
      answer:
        "Sí. Cada participación requiere una nueva verificación. Podés comprar tantos números como desees mientras haya disponibilidad.",
    },
    {
      question: "¿Qué pasa si el número ganador no fue comprado?",
      answer:
        "Si el sorteo está configurado para tener ganador sí o sí, los números vacantes se reasignan aleatoriamente entre los participantes y se vuelve a sortear. Si es un sorteo con premio acumulado, puede declararse vacante.",
    },
    {
      question: "¿Cómo me entero si gané?",
      answer:
        "Al finalizar el sorteo, si resultaste ganador, te notificaremos por la app. Te enviaremos un formulario para que completes tus datos y coordinemos la entrega del premio. Tenés 30 días para iniciar el reclamo y hasta 60 días para completar el proceso. En casos especiales, estos plazos podrán extenderse.",
    },
    {
      question: "¿Y si el premio no se puede entregar?",
      answer:
        "Si por alguna razón no podemos entregarte el premio físico, recibirás una compensación en tokens USDC por el valor estimado del premio.",
    },
    {
      question: "¿Puedo participar desde cualquier país?",
      answer:
        "No. WinTrust solo está disponible para usuarios residentes en Latinoamérica. Además, no está disponible en Estados Unidos, Canadá, Indonesia, Malasia, Tailandia ni Polonia debido a restricciones legales.",
    },
    {
      question: "¿Qué datos recopila WinTrust?",
      answer:
        "Solo verificamos tu identidad mediante World ID. No accedemos a tus datos personales ni los almacenamos.",
    },
    {
      question: "¿Es seguro usar WinTrust?",
      answer:
        "Sí. Todo el sistema está diseñado para que solo humanos reales participen, con pruebas criptográficas y sin posibilidad de manipulación. Además, seguimos todas las directrices de seguridad de World App.",
    },
    {
      question: "¿Hay restricciones sobre los premios?",
      answer:
        "Sí. Los premios no son transferibles, no pueden ser sustituidos por otros bienes, y solo podrán reclamarlos personas mayores de edad con verificación válida.",
    },
    {
      question: "¿Existen costos adicionales?",
      answer:
        "En algunos casos podría aplicarse:\n\n* Costo de envío (según tu ubicación)\n* Seguro de envío (opcional)\n* Costos por embalaje especial (si aplica)\n* Impuestos o tasas locales",
    },
    {
      question: "¿Dónde puedo pedir ayuda o hacer un reclamo?",
      answer: "Desde la app podés acceder al formulario de contacto o escribirnos directamente a soporte@wintrust.site",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Header />

        <Card className="max-w-4xl mx-auto mt-8 p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes (FAQs)</h1>

          <div className="mb-8">
            <p className="text-gray-600 text-center">
              Encuentra respuestas a las preguntas más comunes sobre WinTrust y cómo funciona nuestra plataforma.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 pb-4 text-gray-700">
                    {faq.answer.includes("soporte@wintrust.site") ? (
                      <p>
                        {faq.answer.split("soporte@wintrust.site")[0]}
                        <a href="mailto:soporte@wintrust.site" className="text-primary hover:underline">
                          soporte@wintrust.site
                        </a>
                      </p>
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              ¿No encontraste lo que buscabas? Contáctanos en{" "}
              <a href="mailto:soporte@wintrust.site" className="text-primary hover:underline">
                soporte@wintrust.site
              </a>
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
