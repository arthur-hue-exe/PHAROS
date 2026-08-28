import { useState } from 'react';
import {
  User, CreditCard, CheckCircle2, ChevronLeft, ChevronRight,
  Loader2, MessageCircle, Mail, ShieldCheck, QrCode, CreditCard as CardIcon,
  Check, ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from '@/context/RouterContext';
import { contactInfo } from '@/data/content';

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type Step = 0 | 1 | 2;

export default function Checkout() {
  const { items, subtotal, couponDiscount, total, appliedCoupon, clearCart } = useCart();
  const { navigate } = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', cpf: '',
  });

  if (items.length === 0 && step < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-noir px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-graphite-2">
          <ShieldCheck className="h-8 w-8 text-steel" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-white">
          Nenhum curso selecionado
        </h1>
        <p className="mt-3 text-steel">
          Adicione um curso ao carrinho para iniciar a matrícula.
        </p>
        <button
          onClick={() => {
            navigate({ name: 'home' });
            setTimeout(() => document.querySelector('#cursos')?.scrollIntoView({ behavior: 'smooth' }), 100);
          }}
          className="btn-primary mt-6"
        >
          Ver cursos
        </button>
      </div>
    );
  }

  const canAdvanceStep0 = formData.name.trim().length >= 3 && formData.email.includes('@');
  const canAdvanceStep1 = true; // Payment method is always selected

  const handleNext = () => {
    if (step === 0 && !canAdvanceStep0) return;
    if (step === 1 && !canAdvanceStep1) return;
    if (step === 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 2000);
      return;
    }
    setStep((s) => Math.min(s + 1, 2) as Step);
  };

  const handleFinish = () => {
    clearCart();
    navigate({ name: 'home' });
  };

  const steps = ['Dados pessoais', 'Pagamento', 'Confirmação'];

  return (
    <div className="min-h-screen bg-noir pt-16 md:pt-20">
      <div className="container-x py-10 md:py-14">
        {/* Back */}
        <button
          onClick={() => navigate({ name: 'home' })}
          className="mb-6 flex items-center gap-1.5 text-sm text-steel transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Finalizar Matrícula
        </h1>

        {/* Step indicator */}
        <div className="mt-8 flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-all duration-300 ${
                    i < step
                      ? 'border-pharos-red bg-pharos-red text-white'
                      : i === step
                      ? 'border-pharos-red text-pharos-red'
                      : 'border-white/15 text-steel'
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    i === step ? 'text-white' : 'text-steel'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-px flex-1 bg-white/10">
                  <div
                    className="h-full bg-pharos-red transition-all duration-500"
                    style={{ width: i < step ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Step content */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="animate-fade-in rounded-2xl border border-white/10 bg-graphite-2/60 p-6 md:p-8">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                  <User className="h-5 w-5 text-pharos-red" />
                  Dados pessoais
                </h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="input-label">Nome completo *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="input-label">E-mail *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="input-label">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="(62) 00000-0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="input-label">CPF</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="input-field"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  disabled={!canAdvanceStep0}
                  className="btn-primary mt-6"
                >
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in rounded-2xl border border-white/10 bg-graphite-2/60 p-6 md:p-8">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                  <CreditCard className="h-5 w-5 text-pharos-red" />
                  Pagamento
                </h2>
                <p className="mt-3 text-sm text-steel">
                  Escolha sua forma de pagamento. A integração com o gateway de
                  pagamento será ativada em breve.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex items-center gap-3 rounded-xl border p-5 text-left transition-all duration-300 ${
                      paymentMethod === 'pix'
                        ? 'border-pharos-red bg-pharos-red/10'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <QrCode className="h-6 w-6 text-pharos-red" />
                    <div>
                      <div className="font-display text-base font-semibold text-white">PIX</div>
                      <div className="text-xs text-steel">Aprovação imediata</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-3 rounded-xl border p-5 text-left transition-all duration-300 ${
                      paymentMethod === 'card'
                        ? 'border-pharos-red bg-pharos-red/10'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <CardIcon className="h-6 w-6 text-pharos-red" />
                    <div>
                      <div className="font-display text-base font-semibold text-white">Cartão</div>
                      <div className="text-xs text-steel">Crédito em até 4x</div>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-5 grid gap-4 rounded-xl border border-white/10 bg-graphite/40 p-5">
                    <div>
                      <label className="input-label">Número do cartão</label>
                      <input type="text" className="input-field" placeholder="0000 0000 0000 0000" disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Validade</label>
                        <input type="text" className="input-field" placeholder="MM/AA" disabled />
                      </div>
                      <div>
                        <label className="input-label">CVV</label>
                        <input type="text" className="input-field" placeholder="000" disabled />
                      </div>
                    </div>
                    <p className="text-xs text-steel/60">
                      Campos desativados — integração com gateway em preparo.
                    </p>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-graphite/40 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-noir">
                        <QrCode className="h-7 w-7 text-pharos-red" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Pagamento via PIX</div>
                        <div className="text-xs text-steel">
                          Após confirmar, você receberá o QR Code para pagamento.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary">
                    <ChevronLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <button onClick={handleNext} disabled={loading} className="btn-primary">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin-slow" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Confirmar pagamento
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-scale-in rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center md:p-12">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl">
                  Matrícula confirmada!
                </h2>
                <p className="mt-3 text-steel">
                  Seu pedido foi registrado com sucesso. Em breve você receberá
                  os próximos passos por e-mail e WhatsApp.
                </p>

                {/* Summary */}
                <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-graphite-2/60 p-6 text-left">
                  <h3 className="font-display text-base font-semibold text-white">
                    Resumo da matrícula
                  </h3>
                  <div className="mt-4 space-y-2">
                    {items.map((item) => (
                      <div key={item.course.id} className="flex justify-between text-sm">
                        <span className="text-steel">{item.course.title}</span>
                        <span className="text-white">{formatPrice(item.course.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {couponDiscount > 0 && (
                    <div className="mt-2 flex justify-between text-sm text-green-500">
                      <span>Desconto ({appliedCoupon})</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-display text-base font-bold text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Next steps */}
                <div className="mx-auto mt-8 max-w-md text-left">
                  <h3 className="font-display text-base font-semibold text-white">Próximos passos</h3>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2.5 text-sm text-steel">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      Você receberá um e-mail com a confirmação e detalhes do curso.
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-steel">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      Nossa equipe entrará em contato pelo WhatsApp para finalizar.
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-steel">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      Prepare sua documentação para o primeiro dia de aula.
                    </li>
                  </ul>
                </div>

                {/* Contact options */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Falar pelo WhatsApp
                  </a>
                  <a href={`mailto:${contactInfo.email}`} className="btn-secondary">
                    <Mail className="h-4 w-4" />
                    Enviar e-mail
                  </a>
                </div>

                <button onClick={handleFinish} className="btn-primary mt-6">
                  Voltar ao início
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          {step < 2 && (
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-white/10 bg-graphite-2/60 p-6">
                <h3 className="font-display text-base font-semibold text-white">
                  Resumo do pedido
                </h3>
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.course.id} className="flex gap-3">
                      <img
                        src={item.course.image}
                        alt={item.course.imageAlt}
                        className="h-12 w-12 shrink-0 rounded-md object-cover"
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium leading-snug text-white">
                          {item.course.title}
                        </div>
                        <div className="text-xs text-steel">Qtd: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium text-white">
                        {formatPrice(item.course.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-steel">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Desconto</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2 font-display text-base font-bold text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
