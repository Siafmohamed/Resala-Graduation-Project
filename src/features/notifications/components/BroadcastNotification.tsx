import { Bell, Send, Eye, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBroadcastNotification } from '../hooks/useBroadcastNotification';
import { useSponsorships } from '../../SponsorshipCases/hooks/useSponsorships';

const notificationTypes = [
  { value: 5, label: 'عجز تبرعات', color: 'bg-red-100 text-red-700' },
];

const broadcastSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب').max(100, 'العنوان لا يمكن أن يتجاوز 100 حرف'),
  message: z.string().min(1, 'الرسالة مطلوبة').max(500, 'الرسالة لا يمكن أن تتجاوز 500 حرف'),
  type: z.literal(5),
  relatedEntityId: z.number().min(1, 'id للكفاله يجب أن يكون رقم موجب'),
});

type BroadcastFormValues = z.infer<typeof broadcastSchema>;

export function BroadcastNotification() {
  const { mutateAsync: broadcast, isPending, isSuccess } = useBroadcastNotification();
  const { data: sponsorships, isLoading: isLoadingSponsorships } = useSponsorships();

  const { control, handleSubmit, formState: { errors, isValid, isDirty }, reset, watch } = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      message: '',
      type: 5,
      relatedEntityId: 0,
    },
  });

  const watchedValues = watch();
  const currentType = notificationTypes[0];

  const onSubmit = async (data: BroadcastFormValues) => {
    console.log('📋 Form Data on Submit:', data);
    await broadcast(data);
    reset();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-l from-[#00549A] to-[#004077] px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white font-[Cairo]">
                إرسال إشعار عجز تبرعات
              </CardTitle>
              <p className="text-blue-100 font-[Cairo] mt-1">
                أنشئ إشعارًا يصل إلى جميع المستخدمين
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Fields Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700 font-[Cairo]">
                    عنوان الإشعار <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="title"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        placeholder="مثال: حالة عاجلة جديدة"
                        maxLength={100}
                        className={`font-[Cairo] h-12 text-lg px-4 border-2 ${
                          errors.title 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-[#00549A] focus:ring-blue-100'
                        } rounded-xl transition-all bg-gray-50/50 focus:bg-white`}
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 font-[Cairo] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {errors.title.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 font-[Cairo] mt-1">
                    {watchedValues.title.length}/100 حرف
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700 font-[Cairo]">
                    محتوى الرسالة <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        id="message"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        placeholder="اكتب رسالتك هنا..."
                        maxLength={500}
                        rows={4}
                        className={`w-full font-[Cairo] text-lg px-4 py-4 border-2 rounded-xl resize-none transition-all bg-gray-50/50 focus:bg-white ${
                          errors.message 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-[#00549A] focus:ring-blue-100'
                        } focus:outline-none`}
                      />
                    )}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 font-[Cairo] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {errors.message.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 font-[Cairo] mt-1">
                    {watchedValues.message.length}/500 حرف
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-semibold text-gray-700 font-[Cairo]">
                      نوع الإشعار
                    </Label>
                    <div className="h-12 px-4 flex items-center font-[Cairo] text-lg bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600">
                      {currentType.label}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relatedEntityId" className="text-sm font-semibold text-gray-700 font-[Cairo]">
                      id للكفاله <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="relatedEntityId"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          {isLoadingSponsorships ? (
                            <div className="flex items-center justify-center h-12 px-4 border-2 border-gray-200 rounded-xl bg-gray-50/50">
                              <Loader2 className="w-5 h-5 animate-spin text-[#00549A]" />
                            </div>
                          ) : (
                            <select
                              id="relatedEntityId"
                              value={field.value || ''}
                              onChange={(e) => {
                                const numValue = Number(e.target.value);
                                field.onChange(isNaN(numValue) ? 0 : numValue);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              className={`w-full font-[Cairo] h-12 text-lg px-4 border-2 rounded-xl transition-all bg-gray-50/50 focus:bg-white ${
                                errors.relatedEntityId
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                  : 'border-gray-200 focus:border-[#00549A] focus:ring-blue-100'
                              }`}
                            >
                              <option value="" disabled>اختر برنامج كفالة</option>
                              {sponsorships?.map((sponsorship) => (
                                <option key={sponsorship.id} value={sponsorship.id} className="font-[Cairo]">
                                  {sponsorship.name} (ID: {sponsorship.id})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
                    />
                    {errors.relatedEntityId && (
                      <p className="text-xs text-red-500 font-[Cairo]">{errors.relatedEntityId.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700 font-[Cairo]">معاينة الإشعار</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-[Cairo] ${currentType.color}`}>
                          {currentType.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-[Cairo]">الآن</span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 font-[Cairo] mb-2">
                      {watchedValues.title || 'عنوان الإشعار سيظهر هنا'}
                    </h4>
                    <p className="text-gray-600 font-[Cairo] leading-relaxed">
                      {watchedValues.message || 'محتوى الرسالة سيظهر هنا...'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-[Cairo]">
                        برنامج الكفالة: <span className="font-semibold">
                          {sponsorships?.find(s => s.id === watchedValues.relatedEntityId)?.name || '—'}
                        </span> (ID: <span className="font-mono font-semibold">{watchedValues.relatedEntityId || '—'}</span>)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {isSuccess && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-800 font-[Cairo]">تم الإرسال بنجاح!</p>
                      <p className="text-sm text-green-600 font-[Cairo]">تم إرسال الإشعار إلى جميع المستخدمين</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isPending || !isValid || !isDirty}
                className="w-full lg:w-auto min-w-[200px] h-14 bg-gradient-to-l from-[#00549A] to-[#004077] hover:from-[#004077] hover:to-[#003057] text-white text-lg font-bold font-[Cairo] rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    إرسال الإشعار
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
