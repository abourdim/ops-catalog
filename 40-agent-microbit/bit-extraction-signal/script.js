/**
 * Workshop DIY — Template v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 * Easter eggs: Konami, Morse, Matrix rain, Debug, Shake report, Time-travel, Typewriter
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG (injected once) ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="77.139885 78.322945 253.991455 136.254120"> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797zM208.415588,151.261307L201.927002,151.261307L201.927002,154.5056L208.415588,154.5056L208.415588,151.261307zM195.438385,167.485199L192.194092,167.485199L192.194092,151.263702L195.438385,151.263702L195.438385,167.485199zM214.904205,167.485199L211.659897,167.485199L211.659897,151.263702L214.904205,151.263702L214.904205,167.485199zM201.927002,173.973801L198.682693,173.973801L198.682693,164.240906L205.171295,164.240906L205.171295,160.996597L201.927002,160.996597L201.927002,157.752304L208.415588,157.752304L208.415588,167.485199L201.927002,167.485199L201.927002,173.973801z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M173.301086,159.585083C173.612106,158.491119,173.874039,158.032059,174.626434,157.262268C175.395889,156.475021,176.401733,155.870239,176.941635,155.870239C177.36203,155.870239,177.647339,155.263535,177.647339,154.369537C177.647339,153.240067,178.097351,153.01268,180.332611,153.01268C181.328247,153.01268,182.282974,153.064713,182.454239,153.128311C182.730774,153.231003,182.765625,154.070618,182.765625,160.629913C182.765625,166.947327,182.723099,168.050049,182.471725,168.251938C182.069794,168.574738,178.407364,168.435822,177.965607,168.081009C177.75119,167.908813,177.647324,167.518738,177.647324,166.885712L177.647324,165.94603L176.584106,165.490997C175.198334,164.897919,174.243912,164.070435,173.733398,163.019424C173.265182,162.055481,173.060654,160.43071,173.301086,159.585083z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.601929,182.059692C154.740814,179.364502,156.707062,177.959259,159.536469,177.818451C160.701721,177.760437,161.251312,177.831604,162.144165,178.156082C163.450592,178.630859,165.150406,180.036514,165.749542,181.137527L166.150391,181.874146L171.23761,181.874146C175.554565,181.874146,176.349976,181.830872,176.490891,181.588379C176.673401,181.274307,177.547806,179.367874,178.631622,176.921021C179.274582,175.469437,179.523499,174.921753,180.081848,173.730072L180.595093,172.634674L182.95993,172.634674C184.912933,172.634674,185.324768,172.683594,185.324768,172.915649C185.324768,173.07019,185.049423,173.777435,184.712891,174.487305C184.376358,175.197189,183.943024,176.163757,183.749908,176.635269C183.556793,177.106766,183.115692,178.092621,182.769699,178.826065C182.423691,179.559509,182.025787,180.416779,181.885452,180.73111C181.745102,181.045441,181.453796,181.6884,181.238083,182.159897C181.022369,182.631409,180.643311,183.488678,180.395737,184.064957C179.824722,185.394073,179.204605,186.048218,178.254486,186.3237C177.765457,186.465485,175.502716,186.541504,171.771988,186.541504L166.040741,186.541504L165.659912,187.255905C165.138397,188.234222,163.85675,189.437042,162.748398,189.988312C161.961212,190.379837,161.551163,190.446259,159.943237,190.442749C158.273651,190.439087,157.93721,190.378052,156.97731,189.904602C155.279343,189.067123,154.253754,187.938721,153.568604,186.154144C153.151855,185.06868,153.167999,183.086639,153.601929,182.059692z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.70961,134.681961C154.933441,131.8022,158.021027,130.114639,160.98288,130.70665C163.119888,131.133804,164.512604,132.063324,165.540604,133.74852L166.13118,134.71666L172.036896,134.724625C179.724121,134.734985,179.189514,134.531769,180.806213,138.05806C181.046387,138.58194,181.506516,139.56781,181.828705,140.248856C182.150894,140.929916,182.572266,141.873413,182.765106,142.34552C182.957932,142.817627,183.418945,143.846344,183.789566,144.631577C184.160187,145.416794,184.582855,146.359299,184.72879,146.726013C184.874741,147.092743,185.068542,147.474228,185.159454,147.573761C185.250381,147.673309,185.324768,147.911697,185.324768,148.103516C185.324768,148.42543,185.139572,148.448166,182.920441,148.398804C180.143387,148.337021,180.601318,148.697861,179.105072,145.392487C178.607056,144.292328,177.979095,142.920685,177.709595,142.344406C177.440109,141.768127,177.087021,140.996597,176.924942,140.629868C176.762878,140.263153,176.561615,139.834503,176.477676,139.677338C176.349091,139.436539,175.522827,139.383606,171.225388,139.340881L166.125702,139.290192L165.734726,140.000244C165.222015,140.931427,163.772217,142.287949,162.807831,142.738846C160.99057,143.588516,158.677109,143.612717,156.992996,142.799698C155.47348,142.066116,154.281479,140.67366,153.456284,138.668228C153.079697,137.753036,153.198425,135.884811,153.70961,134.681961z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M142.359467,157.940231C142.509399,157.475464,142.773041,156.807739,142.945313,156.45639C143.301086,155.73085,144.960602,154.086121,145.719666,153.706772C147.453094,152.840485,150.120728,152.779083,151.897141,153.564621C153.038162,154.069183,154.633179,155.561859,155.143616,156.602798L155.49057,157.310364L162.396606,157.310364L169.302643,157.310364L169.245392,159.621033L169.188141,161.931702L162.336823,161.983459L155.485474,162.035233L154.951477,162.917023C154.333344,163.937775,152.845825,165.267944,151.815979,165.720886C151.320953,165.938599,150.48027,166.037445,149.070404,166.043716C147.337799,166.051422,146.909668,165.986923,146.165497,165.606079C144.226196,164.613617,142.876617,163.016098,142.361877,161.103683C141.998642,159.754135,141.998108,159.060349,142.359467,157.940231z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789734,195.730286L203.964523,195.730286L203.964523,199.334839L330.789734,199.334839L330.789734,195.730286z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789551,203.350861L161.68924,203.350861L161.68924,206.955414L330.789551,206.955414L330.789551,203.350861z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M199.007599,92.751289L211.076767,107.812828L202.108658,108.433113L193.221268,96.996552L191.912918,99.119194L192.604614,109.090935L185.184021,109.604782L183.137482,80.08474L190.55806,79.571373L191.466415,92.675797L200.002396,78.91729L208.593674,78.322945L199.007599,92.751289z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M234.138016,81.615562C236.040375,81.751511,237.914093,82.153725,239.704468,82.81044C242.302017,83.709618,244.733612,85.0299,246.901871,86.718407L245.150757,93.244476L244.516693,93.074516L244.196808,92.630768C242.70787,90.69416,240.767151,89.152077,238.543442,88.138672C237.43634,87.647743,236.259094,87.333046,235.05455,87.206039C234.227158,87.13401,233.394257,87.239655,232.611099,87.515953C232.1866,87.685104,231.808258,87.952736,231.507553,88.296593C230.788803,89.172775,230.813843,90.439911,231.566635,91.287064C232.032272,91.758965,232.559708,92.165504,233.134735,92.49572C233.880844,92.934601,234.641342,93.348839,235.414795,93.73764L236.692566,94.414246C238.063751,95.136879,239.357956,95.996429,240.555618,96.979881C241.421173,97.700912,242.148926,98.572769,242.70343,99.552994C243.199982,100.455551,243.47139,101.464417,243.494675,102.49408C243.516479,104.315857,243.04805,106.109734,242.138275,107.688644C241.268204,109.142014,239.979233,110.299194,238.440216,111.008636C236.697495,111.816132,234.786774,112.195747,232.867447,112.115822C231.006363,112.044464,229.16304,111.7258,227.386139,111.168236C225.295883,110.581566,223.299759,109.70047,221.458069,108.551567C220.391022,107.90168,219.366867,107.183914,218.391983,106.402733L220.215729,99.607994L220.868774,99.782715L221.294846,100.371597C223.248032,102.98111,225.940598,104.943588,229.023956,106.004974C230.198563,106.381287,231.426422,106.56295,232.65976,106.542908C233.398315,106.50238,234.108765,106.246048,234.70285,105.805771C235.495346,105.106613,235.762222,103.987152,235.3703,103.006096C234.953918,102.254745,234.346375,101.627075,233.608734,101.186172C232.310593,100.437439,230.990005,99.728287,229.648743,99.059662L228.913788,98.6465C227.703781,97.972984,226.583435,97.149826,225.579315,96.196541C224.730804,95.402397,224.063187,94.435135,223.621811,93.360443C223.239136,92.341805,223.078842,91.253273,223.151657,90.167679C223.224899,88.937332,223.518707,87.730194,224.019104,86.603645C224.773438,84.973534,226.068161,83.653664,227.684143,82.867416C229.688202,81.891472,231.914063,81.459724,234.138016,81.615562z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M158.184418,89.408417L158.63797,89.460617C160.159576,89.664032,161.581177,90.331436,162.709152,91.371941C163.457062,92.134872,164.054443,93.031792,164.469971,94.015739C164.905151,94.958809,165.210938,95.956268,165.379028,96.981071C165.586273,98.309639,165.448776,99.669395,164.979736,100.929688C164.526001,102.206253,163.843109,103.389481,162.9646,104.421295L177.202927,111.835213L168.925079,115.537735L156.954742,109.003616L154.522186,110.091713L158.959137,119.99498L152.206207,123.015327L140.106628,96.007126L150.980728,91.143959C152.423172,90.469635,153.929443,89.940933,155.477051,89.56575C156.366608,89.378746,157.27916,89.325714,158.184418,89.408417zM154.518402,95.879517C153.797302,95.981628,153.094345,96.184746,152.429993,96.482941C151.30661,96.954544,150.192154,97.445801,149.086243,97.956879L152.344727,105.230492C153.226166,104.854858,154.099228,104.460068,154.963409,104.046356C155.701569,103.707794,156.398712,103.2864,157.041443,102.79026C157.931732,102.040565,158.426819,100.923943,158.384399,99.761368C158.265366,98.633255,157.799194,97.57048,157.049652,96.718483C156.493423,96.132034,155.708206,95.817314,154.900574,95.857086L154.518402,95.879517z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M272.812744,97.204483L266.643219,106.109734L274.967194,111.866898L281.13623,102.961639L287.252136,107.192093L270.397125,131.522263L264.281219,127.291809L271.751953,116.507477L263.428467,110.75032L255.957245,121.534653L249.841339,117.304688L266.69635,92.974518L272.812744,97.204483z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M123.532295,113.696442L124.230148,113.777771C126.158524,114.073517,128.005737,114.761353,129.657501,115.798744C132.481201,117.587387,134.876709,119.973488,136.675644,122.789276C137.85083,124.63147,138.576599,126.723907,138.794327,128.897644C139.033569,131.465439,138.466858,134.044128,137.172913,136.275513C135.587463,138.969635,133.343018,141.21608,130.649414,142.80484C127.777443,144.458344,124.36438,144.902039,121.164574,144.037842C119.23671,143.51442,117.427086,142.626587,115.833755,141.422424C113.593025,139.763062,111.674324,137.709213,110.171577,135.361511C108.996712,133.520187,108.266281,131.430969,108.038124,129.259201C107.781654,126.690132,108.338432,124.10524,109.629959,121.869064C111.213356,119.173782,113.45533,116.925095,116.146744,115.332764C118.378197,114.032959,120.960136,113.460907,123.532295,113.696442zM120.237076,120.379318L119.887573,120.406281C118.354965,120.610733,116.961685,121.401001,116.000389,122.611092C115.056374,123.703064,114.59684,125.132736,114.727959,126.569733C114.794571,127.523895,115.040863,128.456757,115.453972,129.31958C116.053543,130.618454,116.854576,131.814713,117.827431,132.864029C118.900902,134.079971,120.115646,135.163635,121.446014,136.092072C122.648727,136.917191,124.021584,137.461685,125.463211,137.685394C127.280067,137.943146,129.110855,137.312714,130.383087,135.991302C131.89679,134.496063,132.46991,132.291229,131.875671,130.248962C131.491013,128.764099,130.784729,127.381737,129.806686,126.199554C128.542725,124.617355,127.058746,123.224152,125.399681,122.062111C124.287796,121.300659,123.037567,120.763733,121.719482,120.481628C121.230911,120.390747,120.733513,120.356422,120.237076,120.379318z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M301.601013,126.300751L302.299225,126.387955C304.863129,126.784752,307.239716,127.969833,309.098511,129.778381C311.170715,131.775146,312.75058,134.224945,313.714081,136.935547C314.870911,140.295837,314.546234,143.989166,312.820984,147.096512C311.958069,148.639557,310.845917,150.029465,309.529388,151.210129C307.452698,153.100769,305.048676,154.597107,302.434753,155.626007C300.399414,156.423401,298.204712,156.731628,296.028259,156.525696C293.460388,156.265411,291.037109,155.212799,289.095093,153.514084C286.754761,151.440582,284.981323,148.806931,283.940704,145.859634C282.870056,142.725098,283.092163,139.293045,284.557861,136.322372C285.44342,134.53299,286.664185,132.92984,288.153931,131.599777C290.215515,129.722946,292.602142,128.237671,295.197113,127.216599C297.231812,126.41954,299.424255,126.105988,301.601013,126.300751zM301.796417,133.319016L301.395599,133.345963C299.740631,133.540878,298.142822,134.070938,296.699768,134.903717C295.098816,135.78006,293.62146,136.865036,292.306549,138.130219C291.264404,139.150299,290.465088,140.391296,289.96759,141.761612C289.36438,143.493225,289.630615,145.409592,290.682953,146.911621C291.859528,148.684113,293.91449,149.671082,296.034698,149.48201C297.567047,149.390991,299.06073,148.964966,300.410278,148.234055C302.207336,147.299255,303.861511,146.112946,305.322906,144.710876C306.284607,143.767151,307.052765,142.644867,307.584167,141.407135C308.377655,139.487228,308.077698,137.288376,306.798889,135.650696C305.90625,134.37352,304.502838,133.544434,302.952667,133.378418C302.570068,133.321472,302.182861,133.301575,301.796417,133.319016z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.52771,174.938004C330.907135,176.376419,331.109863,177.855667,331.131348,179.343048C331.140991,180.913391,330.788269,182.464722,330.100525,183.876755C329.284912,185.402817,327.990417,186.61911,326.415833,187.338638C324.171936,188.395706,321.654877,188.72998,319.212524,188.295227C317.964203,188.048447,316.787842,187.521973,315.772491,186.755524C314.332245,185.751999,313.161652,184.409088,312.364532,182.845856C311.819153,181.800247,311.407227,180.69043,311.138458,179.542328L310.207031,175.759995L300.801575,178.072845L299.023926,170.85611L327.780579,163.784363L330.52771,174.938004zM315.575714,174.43985L315.699463,174.941345C315.911407,175.872101,316.160706,176.794067,316.446716,177.704803C316.734985,178.68222,317.291321,179.559418,318.052795,180.237213C318.620514,180.667114,319.293762,180.936279,320.001617,181.016113C321.123322,181.060883,322.237854,180.828857,323.248352,180.340271C324.14624,179.851425,324.777618,178.986908,324.96933,177.983337C325.126617,177.021484,325.083862,176.037781,324.843781,175.09317C324.644379,174.164948,324.426147,173.241089,324.189056,172.321732L315.575714,174.43985z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M116.693192,163.543213L113.851212,171.179825L95.025467,169.25325L110.58651,179.953522L107.74453,187.590118L77.373581,184.299744L80.062973,177.072876L100.10704,180.173035L83.216843,168.597382L85.788689,161.686646L106.05442,164.191376L88.928635,153.248993L91.548454,146.207825L116.693192,163.543213z"/> </svg>`;

/* ═══════ FOOTER ICON (base64 PNG) ═══════ */

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xgAADEhJREFUeNrtmXtsVNedx7/n3Nfce2eu5+kZezx+MOMZO2PjOOAHBNdAbAR2Uchjo6br7YISqFiiRFrSKIrUAGLdpJtEVTdSkaJVUsRuVEVyE2GSUqALbDYP0WR5WCU2sbFj3MTYBgebuWPPzL1n/wCzxPEjJgmj1c5HOn/NOb97vt9zH7/fb4AMGTJkyJAhQ4YMGTL8f4R8F0FOnDgBURTJ5OQkALCampp06/r+eeutt2Cz2RCNRrPdbvdPNU3ba7PZXnW5XJtLSkp8kiThscceS/c2vx+OHTsGn8+HgoKCQlVVD1JKDQAMAKOUGrIsHwkEAkG73Y4XXngh3dudk1t6BO6++26Ew2HujTfeeFnX9a2Msa8GJQRWq/V3brf7X0zTZABAKQUhBBzHwTCMSZ7nvygtLb0Yj8fZoUOH0u3DwohGoygrKyuUJKkX109++qCUpnieHxcEYWzaGBcEYdRisZzyer0/AICDBw+mW9LCiEQiKC0tXSyK4shsBnyTYbVa31y9erW8ZMmStGnhbmVRfn4+JEkyLl261JRMJv0zzeF5flCSpKMcx3USQroEQThvtVr/SikdAJBlmqbFNM1cXdffGxoa6n3mmWdw9OjRtBmxIB555BEAgNvt/lue58cx7WR5no+53e4tr7/+Or3nnnv4UCjENzU1CY8//rj84IMPyna7/Z8JIQwAs9lsezdv3iysXLky3bIWxtKlS9HQ0CC4XK6tkiR18TyvcxwXkyTprMfj+emGDRvE+vr6r63zer0oKCioEAThrwCYIAiDeXl5d2VnZ6dFxy09AgDw+eefIxKJmGVlZR/ruv6WIAh/UFX13zwez6/Xrl17bHx83Jjp7V5TU4OHH3545P333w8lEomljDErpXRsZGTk8Icffoienp7basB3kgkuFLvdDlmWVwwPD+9PpVIOURR78vLy1iaTye4LFy58bf6KFStgs9m4c+fO+ePxeDiVShUCUE3THLZYLN1Op/PT1tbW0fb2drzyyivpkLQw7rzzTtTX10s2m+3fOY5jPM+bHo/nZwCwY8eOG/Nqa2tx77330kAgUKNp2iuiKHZzHBenlDJCCKOUGjzPfynL8gm73f50KBQKAMC2bdvSLXFuPvroI8iyjOLi4ny/3/83Lpfr4YKCgmWMMbJ7927s3LkTAFBSUpJtt9t3CYIwOPXSnG0QQkyLxXLK7XY379ixg6xevTrdMhfO8PAwQqEQlixZIhYWFq5yuVxtoiheJoSYuCnBEgRhRBCEIUEQhniev0wIMQkhSUEQRlVVPZebm/sQAKxfv37ea36jl2BLSwuWLVtGGGNWURSV6upq9PT0pHJzc3HgwIEFidy2bRueeuopDAwMqPF43BoIBMT6+vqk2+1mbW1t0sWLF9cMDAzsSiQSf+fz+XYxxg5PTEysY4xJAKAoyoVQKPQjURRfttvtr1JKP5yYmPghIaQvOzv7AdM0Px4fH3/W5/Od7OrqGmhtbcXhw4dv7UQ2bdoEl8uFwsLCfE3TfmmxWN4XBOG/FUV5x+12t9TU1Ejl5eULillUVIRgMOizWq1vchx3WlGUQyUlJYX5+fnIycmJiKI4AICpqvrpunXrsh0ORwXHcaNTd4Cqqr1VVVVLwuGwPxqN5ng8nrWU0nFCyEmO42wWi+VOSukVTdPeXLNmjbJ8+fI598PP9WN7eztsNltgcHDwXycnJxunip5kMonJycmVnZ2dRbW1tc/zPJ88efLkvOLz8/ORm5srdXV1rY7H442GYajJZPLLVCrlSCQSffF4XEilUtLU/OlFFgDE4/G8M2fO7GeMpa7PERlj1usGTa0zdV1v7OjoWKbr+p9uyYCGhgYcOXIEyWRy283ipzAMQ47FYv/4wQcfjMZisS6e5+kMYYjVav2yoaHho1OnTqUAuM6cOfMLXdd/ZBiGOiVS13XIsgyv16t0dnaK1xsrs0EAyABMACCEzKjBMAw1Ho83X7ly5U/bt2/HSy+9tDADxsbGUFVV5ezo6Gic6SQAIJVK2cfHx381tZnpMMY4XdePf/LJJ+u7u7tTdrt9aywW22ya5lfyD8MwYJomGGMU8+QmsiwPlJaW/kTX9Yscx5Hh4eHo0NDQXsYYmXZtJBKJOx544AGps7NzVkfprD9cq995QoiEOWCM8ddvw68NABzHcZzT6WTLly+XJiYm6qeLZ4zBNE2YpgnDMDCb2TcvSSQSMV3XRzs6Ojpjsdj52Q6AEKLFYjHBNM1Zg816B+Tk5KCuru5SV1fXx/F4PDqLSSmr1fqBKIqXkslkIhaL6YQQEEJAKQXHcdRms/0lGAymGGPs9OnTV2fZ6A0j5iMej+edPXv2gNVqPffQQw/d//bbb8/l2LxuzmrApk2b0NLSYjgcjt9MTEz8YHJysnD6pkVRfHvx4sWb33333cvd3d1s0aJF5vDwMHw+3415sVgMDQ0NaGlpgcfj+f3k5OSaVCql3Bxnqls01+lTSk1RFEcBmIwxieM4meO4+VL5kZycnMmRkZF5jZ2R++67D4wx+P3+1Yqi/CfHcZcJIaOCIAxpmrbP6/UGnE4ndu3aNW+s8vJyLFu2TPJ4PI/KstwxldzwPD8aCAQqCwoKEIlEakVRHMO0zyCl9Iqqqv01NTUrq6qqSqurq0vr6uoWMcaIzWarpJSO3fwZJISMEkKY3W7fDgBbtmy5NQMA4MUXXwQALF682OlwOCoEQbgrEAjcUVtbqwSDQRw/fvwbx3r22WcBAIsWLaoVBOESACaK4qWSkpKKYDCIcDhcKwjCGACmKEpvcXHxXXa7fS2ldFxV1e7GxsYcURT5rKysXJvNFrDb7XmapjVRSscppX/RNC2qKMo6QsiYIAj9gUCg1Ov1zrmn214NVlZWghCS1d/fv8UwjBJK6ZDD4XiREHJJFMXivr6+38bj8SoAhBAyCIAzDCNHVdXu+vr6Fe+9955L1/XfmaaZhWvPuGiapheAQSkdZIzxALxWq/W5K1eu/LyyspKdOnXqdstcOJs2bQJjDNFo1O1yuX4sy/J/UUpT+N8M8NPm5uZsq9VaQSm9kRnONFRVPRyJRHKKiormve4tN0S+Lffffz+i0agQDoe1aDRquXz5Mvnss89SdXV1eltbW0c4HN6fTCbHDcMoN01TFUXxclFR0at9fX22ZDK5kTFmmR6TEMJkWT7icDi2DQwMfPbcc8+hvb09XRJnp7GxEQDg9Xof1TTtpKZpp3Nzc38GAM8//zwAYNWqVdi6dSv1+/2rFEX5D5vN1lVYWFgty3IzpfQKvloKM0EQLmZlZf0yGAz6srKy8Nprr6Vb5uyEQiFEIhGPJEknADCO42Iej2e9IAhfSVn37dsHAKioqHD4/f573W73L1RV/aMoiv2U0s8lSepVFOW4w+H4p4KCgruam5u5+Yqf7xzGGJ5++mkMDQ2R8+fPE8bYnN/z3bt3AwDcbvdPKKVJXHvjH6murrZVVFTMuGaqT7hu3TqhrKzMEwgEgpqmFZeUlOTX1dWpBw4cQGtr6+0V/sQTT4DjOBQXF+c6nc5tmqa9pmnaPqfT+Q+hUMhjtVpnbE2Vl5ejqqrKpijKIVxrcCRdLtdGAHjyySdvr4hbZc+ePfB4PMjPzy9WFOUYpfTmjo2hKMrBoqKikMfjwdmzZ2+sO378OGRZhs/na+Y4LgaAWSyWP4fD4exgMJgWLbeUB1RWVsLv9/NHjx7do+v6ozP9Oaqq6pt5eXkvM8ZM4NqjYhgGrl69yo2NjW2Px+NNlFKWlZW1fXR09FdNTU145513/m8YEIlEQCkt6unpOZZIJPJnmkMpNTmO+1oZapomMU1TYowRURTP+f3+tYZh9Pb399928cAc5fCcrl0rYBRca0zMiGmaNJlMytOHYRgWxhghhDBRFF/v7e3tLSsrS4t4YJ6W2GxwHAdCyBeU0j4AnpnmCIIwKEnSGdxUklJKQSlliUTiqiAIHVlZWb9RVTUtt/63MmDp0qXYu3fvZafTuSeZTN4x1d66yaCYpmk/37lz529PnjxJGWOglEJVVXi9XiiKYmzcuNGIxWLIy8tLm3jgWxRDPp8PsiwLY2Njfx+LxR43DKMAAOE4blCW5Zc8Hs+ruq4nBwYG0irwezMAADZs2IDS0lLS1tbmNU0zQCmlkiR9UV1dfWF4eJjt378/3foyZMiQIUOGDBkyZMiQIcNM/A+SuM25qDqHNQAAAB50RVh0aWNjOmNvcHlyaWdodABHb29nbGUgSW5jLiAyMDE2rAszOAAAABR0RVh0aWNjOmRlc2NyaXB0aW9uAHNSR0K6kHMHAAAAAElFTkSuQmCC';
/* ═══════ LIGHT THEMES LIST ═══════ */

const LIGHT_THEMES = ['riad', 'medina'];

/* ═══════ APP VERSION ═══════ */

const APP_VERSION = '1.0';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
 if (!soundEnabled) return;
 if (!audioCtx) audioCtx = new AudioCtx();
 const osc = audioCtx.createOscillator();
 const gain = audioCtx.createGain();
 osc.connect(gain);
 gain.connect(audioCtx.destination);
 gain.gain.value = 0.08;
 const t = audioCtx.currentTime;
 switch (type) {
 case 'click':
 osc.frequency.value = 800; osc.type = 'sine';
 gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
 osc.start(t); osc.stop(t + 0.08); break;
 case 'success':
 osc.frequency.value = 523; osc.type = 'sine';
 gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
 osc.start(t); osc.stop(t + 0.3);
 const osc2 = audioCtx.createOscillator();
 const gain2 = audioCtx.createGain();
 osc2.connect(gain2); gain2.connect(audioCtx.destination);
 gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
 gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
 osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
 case 'error':
 osc.frequency.value = 200; osc.type = 'square';
 gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
 osc.start(t); osc.stop(t + 0.25); break;
 }
}

/* ═══════ i18n ═══════ */

// ── Shared i18n keys (template) ──
const LANG_BASE = {
 en: {
 copied:'Copied!',
 demoNext:'Next',
 demoPause:'Pause',
 demoPlay:'Play',
 demoPrev:'Prev',
 learnAge:'Ages:',
 learnLevel:'Level:',
 learnTime:'Time:',
 logCleared:'Log cleared',
 sectionCode:'Device Code',
 sectionDemo:'Watch Demo',
 sectionLearn:'What You Shall Learn',
 splashHint:'tap to skip'
 ,
 shortcutsTitle:'⌨️ Keyboard Shortcuts',
 shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
 achieveTitle:'🏆 Achievements',
 achieveExplorer:'Explorer — visited 4+ help tabs',
 achieveScientist:'Scientist — revealed 2+ challenge answers',
 achieveExperimenter:'Experimenter — changed 5+ parameters'
 },
 fr: {
 copied:'Copié !',
 demoNext:'Suiv',
 demoPause:'Pause',
 demoPlay:'Jouer',
 demoPrev:'Préc',
 learnAge:'Âge :',
 learnLevel:'Niveau :',
 learnTime:'Durée :',
 logCleared:'Journal effacé',
 sectionCode:'Code Appareil',
 sectionDemo:'Voir la Démo',
 sectionLearn:'Ce que tu vas apprendre',
 splashHint:'appuyer pour passer'
 },
 ar: {
 copied:'تم النسخ!',
 demoNext:'التالي',
 demoPause:'إيقاف',
 demoPlay:'تشغيل',
 demoPrev:'السابق',
 learnAge:'العمر:',
 learnLevel:'المستوى:',
 learnTime:'المدة:',
 logCleared:'تم مسح السجل',
 sectionCode:'كود الجهاز',
 sectionDemo:'شاهد العرض',
 sectionLearn:'ماذا ستتعلم',
 splashHint:'انقر للتخطي'
 }
};

const LANG = {
 en: {
 ...LANG_BASE.en,
 diffTitle:'Difficulty',diffBeginner:'🟢 Beginner',diffIntermediate:'🟡 Intermediate',diffExpert:'🔴 Expert',diffInfo:'Choose your complexity level',spacedTitle:'📅 Spaced Review',spacedReview:'Review',spacedNext:'Next review',spacedMastered:'Mastered',spacedNew:'New — not yet studied',spacedDue:'Due for review!',spacedInfo:'Smart review reminders based on the forgetting curve',
 
 missionTitle:'MISSION BRIEFING',missionClassified:'CLASSIFIED',missionObjective:'Your mission objective:',missionAgent:'AGENT-543353',missionSkip:'Skip',missionGo:'ACCEPT MISSION',mission_obj:'Explore and master Extraction Signal \u2014 analyze, experiment, and complete all challenges.',nightVisionTitle:'Night Vision Mode',nightVisionOn:'NV ON',nightVisionOff:'NV OFF',nightVisionAuto:'Auto NV',
 termTitle:'>_ Terminal',termPlaceholder:'Type a command...',termHelp:'Commands: help, start, stop, reset, theme [name], lang [en|fr|ar], set [param] [value], get [param], list, export, clear, status, about, cipher',termUnknown:'Unknown command. Type help for available commands.',termWelcome:'Terminal ready. Type help to get started.',cipherTitle:'🔐 Cipher Toolkit',cipherInput:'Input text',cipherOutput:'Output',cipherEncode:'Encode',cipherDecode:'Decode',cipherMethod:'Method',cipherKey:'Key',cipherCopy:'Copy',
 
 particleTitle:'🎆 Particles',particleToggle:'Toggle Particles',compareTitle:'📊 Compare',compareSave:'Save',compareLoad:'Load',compareDiff:'Difference',compareClear:'Clear',compareSlotA:'Experiment A',compareSlotB:'Experiment B',compareResult:'Comparison Result',
 
 
 labTitle:'📓 Lab Notebook',labGenerate:'📓 Lab Report',labExport:'Export Report',labHypothesis:'HYPOTHESIS',labMethod:'METHOD',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:' Data Recorder',recorderStart:' Record',recorderStop:' Stop',recorderClear:'Clear',recorderExport:'Export CSV',recorderPoints:'pts',recorderGraph:'Graph',
 voiceTitle:'🎤 Voice',voiceOn:'Voice ON',voiceOff:'Voice OFF',voiceListening:'Listening...',voiceCmd:'Command recognised',voiceHelp:'Say: start, stop, reset, help, theme, next, previous',voice_cmds:'start / stop / reset / help / theme / next / previous',shareTitle:'📤 Share',shareBtn:'📤 Share',shareCopied:'Copied to clipboard!',shareGenerate:'Generate Summary',shareExport:'Export JSON',
 
 
 dailyTitle:'📅 Daily Challenge',dailyChallenge:'Today\x27s Challenge',dailyHint:'Show Hint',dailyStreak:'Streak',dailyComplete:'Mark Complete',daily_d1:'Explain how Bit Extraction Signal works to a friend in under 60 seconds.',daily_d2:'Find 3 real-world applications of Agent Microbit concepts shown here.',daily_d3:'Change one parameter to its extreme value and document what happens.',daily_d4:'Draw a diagram showing the data flow in this Agent Microbit simulation.',daily_d5:'Write pseudocode for the main algorithm used in this app.',daily_d6:'Compare results at default vs modified settings and note 3 differences.',daily_d7:'Create a hypothesis about what happens if you double the main parameter, then test it.',mentorTitle:'🎓 Guided Tutorial',mentorStart:'Start Tutorial',mentorNext:'Next',mentorPrev:'Previous',mentorDone:'Finish',mentorStep:'Step',mentor_s1:'Look at the main visualization area — this is where the simulation runs in real time.',mentor_s2:'Press Start to begin the simulation. Watch how the display reacts to your input.',mentor_s3:'Try adjusting one slider — watch how it affects the output immediately.',mentor_s4:'Open the Help panel and explore the Wiki tab for deeper knowledge.',mentor_s5:'Complete one challenge to test your understanding of the concepts.',
 sonifyTitle:'🔊 Data Sonification',sonifyOn:'Sonification ON',sonifyOff:'Sonification OFF',sonifyFreq:'Frequency',sonifyVol:'Volume',sonifyWave:'Waveform',sonifyInfo:'Turn data into sound',
 tooltipTitle:'Smart Tooltips',tooltipToggle:'Toggle Tooltips',tip_start:'Start the simulation and watch the visualization come alive',tip_stop:'Pause the simulation while preserving current state',tip_reset:'Clear all data and return to initial conditions',tip_slider:'Drag to adjust this parameter — the visualization updates in real time',tip_theme:'Switch between 8 visual themes including 2 light Islamic designs',tip_help:'Open the help panel with FAQ, guides, wiki, and challenges',explorerTitle:'Parameter Space Explorer',explorerStart:'Auto-Explore',explorerStop:'Stop Exploration',explorerProgress:'Exploring combinations...',explorerResult:'Exploration Complete',explorerInfo:'Systematically tests min/mid/max for each slider and records results',
 
 title: 'Extraction Signal', subtitle: '🚁 extraction signal — emergency beacon',
 disconnected: 'Disconnected', connected: 'Connected',
 mainSection: 'Extraction Signal — Emergency Beacon', mainDesc: 'Broadcast coded emergency extraction requests',
 sectionA: 'How It Works', sectionB: 'Lab', sectionC: 'Challenge',
 activityLog: 'Activity Log', eventsMsg: 'Events & messages',
 clear: 'Clear', copy: 'Copy', theme: 'Theme',
 settings: '⚙️ Settings', language: 'Language',
 helpSettings: '❓ Help & Settings', settingsTab: '⚙️',
 help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
 howto_1:'The main display shows the Extraction Signal simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Encode agent ID, status, and location into a compact binary ',
 howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
 howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
 howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
 wiki_beacons_title: '🚨 Emergency Beacons', wiki_beacons: 'Emergency beacons (ELT, PLB, EPIRB) are devices that transmit distress signals on 406 MHz to satellites in the COSPAS-SARSAT system for search and rescue.',
 wiki_elt_title: '🛩️ ELT / PLB', wiki_elt: 'ELT (Emergency Locator Transmitter) is for aircraft. PLB (Personal Locator Beacon) is portable. Both encode a unique ID and GPS coordinates into a digital burst.',
 wiki_encoding_title: '🔢 Signal Encoding', wiki_encoding: 'Emergency signals encode identity, location, and status into compact binary frames using bit-packing, checksums, and error correction codes.',
 wiki_rescue_title: '🚁 Rescue Protocols', wiki_rescue: 'Rescue protocols define priority triage (routine, urgent, critical, MAYDAY), response times, and acknowledgment procedures for extraction operations.',
 working: 'Working…',
 t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
 t_riad: 'Riad', t_medina: 'Medina',
 t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
 ready: '🚁 Extraction beacon system ready!',
 logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
 export: 'Export', filterAll: 'All',
 soundEffects: '🔊 Sound effects',
 whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
 musicMode: 'Music reactive', chatPlaceholder: 'Talk to the robot...',
 splashHint: 'tap to skip',
 newVersion: 'UPDATE',
 langChanged: '🌐 Language → English',
 themeChanged: '🎨 Theme →',
 // Beacon-specific keys
 beaconLabel: 'BEACON STATUS',
 standby: 'STANDBY', broadcasting: 'BROADCASTING', acknowledged: 'ACKNOWLEDGED',
 priorityLabel: 'Priority Level',
 priorityLow: 'Low (routine)', priorityMedium: 'Medium (urgent)', priorityHigh: 'High (critical)', priorityMayday: 'MAYDAY',
 agentIdLabel: 'Agent ID', statusLabel: 'Status', gridLabel: 'Grid Coordinates',
 statusOk: 'OK', statusInjured: 'Injured', statusCompromised: 'Compromised', statusUnderfire: 'Under fire',
 activateBtn: 'Activate Beacon', cancelBtn: 'Cancel',
 frameLabel: 'ENCODED EMERGENCY PACKET',
 beaconActivated: '🚨 BEACON ACTIVATED — broadcasting on emergency frequency',
 beaconCancelled: '🔴 Beacon cancelled — returning to standby',
 rescueAck: '🚁 RESCUE ACKNOWLEDGED — extraction team dispatched!',
 txFrame: '📡 TX Frame:',
 repeatBroadcast: '📡 Repeat broadcast #',
 fillRequired: '⚠️ Fill in Agent ID and Grid Coordinates',
 howItWorks1: 'Encode agent ID, status, and location into a compact binary frame.',
 howItWorks2: 'The beacon transmits the frame on the emergency frequency.',
 howItWorks3: 'The signal repeats every N seconds (faster for higher priority).',
 howItWorks4: 'The rescue team receives, decodes, and acknowledges the beacon.',
 lab1: 'Build different emergency messages and observe the encoded frames.',
 lab2: 'Compare priority levels: see how pulse speed and color change.',
 lab3: 'Decode an intercepted beacon: paste hex in Agent ID and observe.',
 lab4: 'Measure response time: activate and watch the rescue acknowledgment timer.',
 challenge1: 'Encode a MAYDAY signal using the minimum number of bytes possible.',
 challenge2: 'Decode an unknown beacon frame: what agent, status, and location does it contain?',
 challenge3: 'Design a stealth extraction protocol that minimizes signal detectability.',step1Title:'Gear Up',step1Desc:'Encode agent ID, status, and location into a compact binary frame. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Deploy',step2Desc:'The beacon transmits the frame on the emergency frequency. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Monitor',step3Desc:'The signal repeats every N seconds (faster for higher priority). This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Extract',step4Desc:'The rescue team receives, decodes, and acknowledges the beacon. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Extraction Signal?',faq_a1:'Extraction Signal is an interactive simulation that demonstrates autonomous agents concepts. Broadcast coded emergency extraction requests. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real tactical communication behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real tactical communication principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need RPi + micro:bit. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Bit Dead Man Switch and Bit Invisible Fence. Each app in this category teaches a different aspect of tactical communication.',demo_s1:'Welcome to Extraction Signal! Look at the main display — this is where the tactical communication simulation runs.',demo_s2:'Enter your Agent ID, select your status, and type grid coordinates. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of tactical communication.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Field Equipment',learn1Desc:'How agents select and configure mission gear. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Tradecraft',learn2Title:'Covert Comms',learn2Desc:'How to set up secure communication channels. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'COMSEC',learn3Title:'Surveillance',learn3Desc:'How to monitor areas and detect threats. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Intel',learn4Title:'Extraction',learn4Desc:'How to collect and secure intelligence safely. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Operations',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Extraction Signal! This is like a science experiment on your computer. You get to control a real autonomous agents simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Encode agent ID, status, and location into a compa Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches tactical communication concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'MicroPython (micro:bit)',codeSnippet:'from microbit import *\\nimport radio\\n\\nradio.on()\\nradio.config(group=42, power=7)\\n\\nwhile True:\\n msg = radio.receive()\\n if msg:\\n display.scroll(msg)\\n if button_a.was_pressed():\\n radio.send("HELLO")\\n display.show(Image.YES)',codeExplain:'This code turns on the micro:bit radio on group 42 at full power. When button A is pressed, it broadcasts "HELLO". Any received message scrolls across the LED display. Group numbers act like channels — only micro:bits on the same group hear each other.',purpose:'Extraction Signal: Broadcast coded emergency extraction requests. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Gear Up through Deploy to Monitor and Extract.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'esc-stylometry-defeater',related1_desc:'',related1_path:'../../55-escape-evasion/esc-stylometry-defeater/index.html',related2_name:'Onion Relay Network',related2_desc:'Build circuits & send encrypted messages through relay nodes',related2_path:'../../02-spy-esp32/esp-tor-relay/index.html',related3_name:'esc-forensic-evidence-planter',related3_desc:'',related3_path:'../../55-escape-evasion/esc-forensic-evidence-planter/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Dead Man\\',pathPrev_path:'../../40-agent-microbit/bit-dead-man-switch/index.html',pathNext_name:'Invisible Fence — Perimeter Security',pathNext_path:'../../40-agent-microbit/bit-invisible-fence/index.html',
 shortcutsTitle:'⌨️ Keyboard Shortcuts',
 shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
 achieveTitle:'🏆 Achievements',
 achieveExplorer:'Explorer — visited 4+ help tabs',
 achieveScientist:'Scientist — revealed 2+ challenge answers',
 achieveExperimenter:'Experimenter — changed 5+ parameters'
 ,
 printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does AI stand for?',quiz_q1a:'Automated Input',quiz_q1b:'Artificial Intelligence',quiz_q1c:'Analog Interface',quiz_q1d:'Active Integration',quiz_q1_answer:'1',quiz_q2:'In Morse code, what represents the letter E?',quiz_q2a:'Dash',quiz_q2b:'Single dot',quiz_q2c:'Two dots',quiz_q2d:'Dot-dash',quiz_q2_answer:'1',quiz_q3:'What unit is commonly used for signal strength?',quiz_q3a:'Hertz',quiz_q3b:'Decibels (dBm)',quiz_q3c:'Watts only',quiz_q3d:'Meters',quiz_q3_answer:'1',quiz_q4:'How many LEDs does the micro:bit display have?',quiz_q4a:'16',quiz_q4b:'25',quiz_q4c:'36',quiz_q4d:'64',quiz_q4_answer:'1',quiz_q5:'Who invented Morse code?',quiz_q5a:'Tesla',quiz_q5b:'Samuel Morse',quiz_q5c:'Edison',quiz_q5d:'Bell',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'The Aldrich Ames case (1994) revealed how a CIA mole used dead drops to pass classified intelligence to the Soviet Union for nearly a decade before detection, compromising over 100 operations.',realworld2:'Operation Ivy Bells (1970s-80s) was a joint NSA/Navy mission to tap Soviet undersea communication cables in the Sea of Okhotsk. Divers placed recording pods on the cable, retrieving them monthly by submarine.',realworld3:'Numbers Stations have broadcast encrypted shortwave messages to field agents since the Cold War. UVB-76 (the Buzzer) in Russia has transmitted a monotone buzz since 1982, occasionally interrupted by coded voice messages.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In field agent ops, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in field agent ops and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Extraction Signal demonstrates a fundamental concept in field agent ops. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Extraction Signal have direct real-world applications. Professionals in field agent ops use these same concepts daily. In industry, micro:bit and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with field agent ops carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.',proTipTitle:'💡 Pro Tips',proTip1:'Always check your battery level before field operations. A dying micro:bit produces unreliable sensor readings that can corrupt your entire dataset.',proTip2:'Use radio group numbers above 100 to avoid interference from other micro:bit users in the area. Default groups 0-10 are crowded.',funFactTitle:'🎯 Did You Know?',funFact:'During the Cold War, the CIA built a robot dragonfly in the 1970s to carry a miniature microphone. Project Insectothopter was abandoned because it couldn\\x27t fly in wind.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
 wiki_history_title: '📜 History of Autonomous Agents',
 wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Extraction Signal builds on this foundation, letting you explore these historical concepts through interactive simulation.',
 wiki_math_title: '📐 Mathematics Behind Extraction Signal',
 wiki_math: 'The mathematics behind Extraction Signal: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity.',
 wiki_advanced_title: '🔬 Advanced Techniques',
 wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced autonomous agents practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
 wiki_compare_title: '⚖️ Comparing Approaches',
 wiki_compare: 'There are several approaches to autonomous agents. Hardware-based solutions using BBC micro:bit offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
 wiki_debug_title: '🔧 Troubleshooting Guide',
 wiki_debug: 'Common issues when working with autonomous agents: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in autonomous agents.',
 wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
 wiki_ethics: 'Autonomous Agents carries important ethical and legal responsibilities. Many countries regulate the use of BBC micro:bit and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
 gloss1_term: 'SNR',
 gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
 gloss2_term: 'Hertz (Hz)',
 gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
 gloss3_term: 'Beacon Interval',
 gloss3_def: 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
 gloss4_term: 'Latency',
 gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
 gloss5_term: 'Throughput',
 gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
 gloss6_term: 'Protocol',
 gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
 theoryTitle: '📖 Theory & Background',
 theory: 'Extraction Signal demonstrates key principles from autonomous agents. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
 faq_q9: 'What common mistakes should I avoid?',
 faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
 faq_q10: 'How does this relate to real-world autonomous agents?',
 faq_a10: 'This simulation models the same physics and mathematics used in professional autonomous agents systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use BBC micro:bit hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
 glossTitle: '📚 Key Terms',
 fr: {
 
 ...LANG_BASE.fr,
 diffTitle:'Difficulté',diffBeginner:'🟢 Débutant',diffIntermediate:'🟡 Intermédiaire',diffExpert:'🔴 Expert',diffInfo:'Choisissez votre niveau de complexité',spacedTitle:'📅 Révision espacée',spacedReview:'Réviser',spacedNext:'Prochaine révision',spacedMastered:'Maîtrisé',spacedNew:'Nouveau — pas encore étudié',spacedDue:'Révision nécessaire !',spacedInfo:'Rappels intelligents basés sur la courbe de l\x27oubli',
 
 missionTitle:'BRIEFING DE MISSION',missionClassified:'CLASSIFI\xc9',missionObjective:'Objectif de mission :',missionAgent:'AGENT-543353',missionSkip:'Passer',missionGo:'ACCEPTER LA MISSION',mission_obj:'Explorer et ma\xeetrisez Extraction Signal \u2014 analysez, exp\xe9rimentez et compl\xe9tez tous les d\xe9fis.',nightVisionTitle:'Mode Vision Nocturne',nightVisionOn:'VN ON',nightVisionOff:'VN OFF',nightVisionAuto:'VN Auto',
 termTitle:'>_ Terminal',termPlaceholder:'Tapez une commande...',termHelp:'Commandes : help, start, stop, reset, theme [nom], lang [en|fr|ar], set [param] [valeur], get [param], list, export, clear, status, about, cipher',termUnknown:'Commande inconnue. Tapez help pour la liste.',termWelcome:'Terminal pr\x27et. Tapez help pour commencer.',cipherTitle:'🔐 Chiffrement',cipherInput:'Texte source',cipherOutput:'R\xe9sultat',cipherEncode:'Encoder',cipherDecode:'D\xe9coder',cipherMethod:'M\xe9thode',cipherKey:'Cl\xe9',cipherCopy:'Copier',
 
 particleTitle:'🎆 Particules',particleToggle:'Basculer Particules',compareTitle:'📊 Comparer',compareSave:'Sauvegarder',compareLoad:'Charger',compareDiff:'Différence',compareClear:'Effacer',compareSlotA:'Expérience A',compareSlotB:'Expérience B',compareResult:'Résultat de comparaison',
 
 peerTitle:'👥 Peer Mode',peerConnect:'Connect',peerDisconnect:'Disconnect',peerStatus:'Peer Status',peerSend:'Sent',peerReceive:'Received',peerInfo:'Open this app in two tabs to sync parameters via BroadcastChannel',heatmapTitle:'📅 Activity Heatmap',heatmapToday:'Today',heatmapStreak:'Streak',heatmapTotal:'Total',heatmapLegend:'Less \u2192 More',
 
 labTitle:'📓 Cahier de labo',labGenerate:'📓 Rapport de labo',labExport:'Exporter le rapport',labHypothesis:'HYPOTH\xc8SE',labMethod:'M\xc9THODE',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:' Enregistreur',recorderStart:' Enregistrer',recorderStop:' Arr\xeater',recorderClear:'Effacer',recorderExport:'Exporter CSV',recorderPoints:'pts',recorderGraph:'Graphique',
 voiceTitle:'🎤 Voix',voiceOn:'Voix ON',voiceOff:'Voix OFF',voiceListening:'Écoute...',voiceCmd:'Commande reconnue',voiceHelp:'Dites : démarrer, arrêter, aide, thème, suivant, précédent',voice_cmds:'démarrer / arrêter / aide / thème / suivant / précédent',shareTitle:'📤 Partager',shareBtn:'📤 Partager',shareCopied:'Copié dans le presse-papiers !',shareGenerate:'Générer le résumé',shareExport:'Exporter JSON',
 
 
 dailyTitle:'📅 D\xe9fi du jour',dailyChallenge:'D\xe9fi d\x27aujourd\x27hui',dailyHint:'Voir l\x27indice',dailyStreak:'S\xe9rie',dailyComplete:'Marquer termin\xe9',daily_d1:'Explique comment Bit Extraction Signal fonctionne \xe0 un ami en moins de 60 secondes.',daily_d2:'Trouve 3 applications r\xe9elles des concepts de Agent Microbit montr\xe9s ici.',daily_d3:'Change un param\xe8tre \xe0 sa valeur extr\xeame et documente ce qui se passe.',daily_d4:'Dessine un diagramme montrant le flux de donn\xe9es dans cette simulation de Agent Microbit.',daily_d5:'\xc9cris le pseudocode de l\x27algorithme principal utilis\xe9 dans cette app.',daily_d6:'Compare les r\xe9sultats avec les param\xe8tres par d\xe9faut et modifi\xe9s et note 3 diff\xe9rences.',daily_d7:'Formule une hypoth\xe8se sur ce qui se passe si tu doubles le param\xe8tre principal, puis teste-la.',mentorTitle:'🎓 Tutoriel guid\xe9',mentorStart:'D\xe9marrer le tutoriel',mentorNext:'Suivant',mentorPrev:'Pr\xe9c\xe9dent',mentorDone:'Terminer',mentorStep:'\xc9tape',mentor_s1:'Regarde la zone de visualisation principale — c\x27est l\xe0 que la simulation tourne en temps r\xe9el.',mentor_s2:'Appuie sur D\xe9marrer pour lancer la simulation. Observe comment l\x27affichage r\xe9agit.',mentor_s3:'Essaie de modifier un curseur — observe comment cela affecte le r\xe9sultat imm\xe9diatement.',mentor_s4:'Ouvre le panneau Aide et explore l\x27onglet Wiki pour approfondir tes connaissances.',mentor_s5:'Compl\xe8te un d\xe9fi pour tester ta compr\xe9hension des concepts.',
 sonifyTitle:'🔊 Sonification des données',sonifyOn:'Sonification activée',sonifyOff:'Sonification désactivée',sonifyFreq:'Fréquence',sonifyVol:'Volume',sonifyWave:'Forme d\x27onde',sonifyInfo:'Transformez les données en son',
 tooltipTitle:'Infobulles intelligentes',tooltipToggle:'Activer les infobulles',tip_start:'Lancer la simulation et observer la visualisation s\x27animer',tip_stop:'Mettre en pause la simulation en conservant l\x27état actuel',tip_reset:'Effacer toutes les données et revenir aux conditions initiales',tip_slider:'Glisser pour ajuster ce paramètre — la visualisation se met à jour en temps réel',tip_theme:'Basculer entre 8 thèmes visuels dont 2 thèmes clairs islamiques',tip_help:'Ouvrir le panneau d\x27aide avec FAQ, guides, wiki et défis',explorerTitle:'Explorateur d\x27espace paramétrique',explorerStart:'Auto-Explorer',explorerStop:'Arrêter l\x27exploration',explorerProgress:'Exploration des combinaisons...',explorerResult:'Exploration terminée',explorerInfo:'Teste systématiquement min/milieu/max pour chaque curseur et enregistre les résultats',
 
 title: 'Extraction Signal', subtitle: '🚁 signal d\'extraction — balise d\'urgence',
 disconnected: 'Déconnecté', connected: 'Connecté',
 mainSection: 'Signal d\'Extraction — Balise d\'Urgence', mainDesc: 'Diffuser des demandes d\'extraction d\'urgence codées',
 sectionA: 'Comment ça marche', sectionB: 'Labo', sectionC: 'Défi',
 activityLog: 'Journal', eventsMsg: 'Événements et messages',
 clear: 'Effacer', copy: 'Copier', theme: 'Thème',
 settings: '⚙️ Paramètres', language: 'Langue',
 helpSettings: '❓ Aide & Paramètres', settingsTab: '⚙️',
 help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
 howto_1:'L écran principal affiche la simulation Extraction Signal. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Encode agent ID, status, and location into a compact binary ',
 howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
 howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
 howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
 wiki_beacons_title: '🚨 Balises d\'urgence', wiki_beacons: 'Les balises d\'urgence (ELT, PLB, EPIRB) transmettent des signaux de détresse sur 406 MHz vers les satellites COSPAS-SARSAT pour la recherche et le sauvetage.',
 wiki_elt_title: '🛩️ ELT / PLB', wiki_elt: 'L\'ELT (Emergency Locator Transmitter) est pour les avions. Le PLB (Personal Locator Beacon) est portable. Les deux encodent un ID unique et des coordonnées GPS.',
 wiki_encoding_title: '🔢 Encodage du signal', wiki_encoding: 'Les signaux d\'urgence encodent l\'identité, la position et le statut dans des trames binaires compactes avec bit-packing, checksums et codes correcteurs.',
 wiki_rescue_title: '🚁 Protocoles de sauvetage', wiki_rescue: 'Les protocoles de sauvetage définissent le triage (routine, urgent, critique, MAYDAY), les temps de réponse et les procédures d\'accusé de réception.',
 working: 'En cours…',
 t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
 t_riad: 'Riad', t_medina: 'Médina',
 t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
 ready: '🚁 Système de balise d\'extraction prêt !',
 logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
 export: 'Exporter', filterAll: 'Tout',
 soundEffects: '🔊 Effets sonores',
 whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
 musicMode: 'Réactif musique', chatPlaceholder: 'Parle au robot...',
 splashHint: 'appuyer pour passer',
 newVersion: 'MAJ',
 langChanged: '🌐 Langue → Français',
 themeChanged: '🎨 Thème →',
 beaconLabel: 'ÉTAT DE LA BALISE',
 standby: 'EN ATTENTE', broadcasting: 'DIFFUSION', acknowledged: 'ACCUSÉ REÇU',
 priorityLabel: 'Niveau de priorité',
 priorityLow: 'Bas (routine)', priorityMedium: 'Moyen (urgent)', priorityHigh: 'Haut (critique)', priorityMayday: 'MAYDAY',
 agentIdLabel: 'ID Agent', statusLabel: 'Statut', gridLabel: 'Coordonnées grille',
 statusOk: 'OK', statusInjured: 'Blessé', statusCompromised: 'Compromis', statusUnderfire: 'Sous le feu',
 activateBtn: 'Activer la balise', cancelBtn: 'Annuler',
 frameLabel: 'PAQUET D\'URGENCE ENCODÉ',
 beaconActivated: '🚨 BALISE ACTIVÉE — diffusion sur fréquence d\'urgence',
 beaconCancelled: '🔴 Balise annulée — retour en attente',
 rescueAck: '🚁 SAUVETAGE CONFIRMÉ — équipe d\'extraction envoyée !',
 txFrame: '📡 Trame TX :',
 repeatBroadcast: '📡 Rediffusion #',
 fillRequired: '⚠️ Remplir l\'ID Agent et les coordonnées',
 howItWorks1: 'Encoder l\'ID agent, le statut et la position dans une trame binaire compacte.',
 howItWorks2: 'La balise transmet la trame sur la fréquence d\'urgence.',
 howItWorks3: 'Le signal se répète toutes les N secondes (plus rapide en haute priorité).',
 howItWorks4: 'L\'équipe de sauvetage reçoit, décode et accuse réception de la balise.',
 lab1: 'Construire différents messages d\'urgence et observer les trames encodées.',
 lab2: 'Comparer les niveaux de priorité : observer la vitesse et la couleur des pulsations.',
 lab3: 'Décoder une balise interceptée : coller l\'hex dans l\'ID Agent et observer.',
 lab4: 'Mesurer le temps de réponse : activer et observer le chrono d\'accusé de réception.',
 challenge1: 'Encoder un signal MAYDAY en utilisant le minimum d\'octets possible.',
 challenge2: 'Décoder une trame de balise inconnue : quel agent, statut et position contient-elle ?',
 challenge3: 'Concevoir un protocole d\'extraction furtif minimisant la détectabilité du signal.',step1Title:'S\'équiper',step1Desc:'Encode agent ID, status, and location into a compact binary frame. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Déployer',step2Desc:'The beacon transmits the frame on the emergency frequency. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Surveiller',step3Desc:'The signal repeats every N seconds (faster for higher priority). Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Extraire',step4Desc:'The rescue team receives, decodes, and acknowledges the beacon. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Extraction Signal ?',faq_a1:'Extraction Signal est une simulation interactive qui démontre les concepts de agents autonomes. Broadcast coded emergency extraction requests. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de communication tactique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de communication tactique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut RPi + micro:bit. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de communication tactique.',demo_s1:'Bienvenue dans Extraction Signal ! Regarde l\'écran principal — c\'est ici que la simulation de communication tactique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de communication tactique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Field Equipment',learn1Desc:'How agents select and configure mission gear. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Tradecraft',learn2Title:'Covert Comms',learn2Desc:'How to set up secure communication channels. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'COMSEC',learn3Title:'Surveillance',learn3Desc:'How to monitor areas and detect threats. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Intel',learn4Title:'Extraction',learn4Desc:'How to collect and secure intelligence safely. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Operations',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Extraction Signal ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de agents autonomes — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Encode agent ID, status, and location into a compa Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de communication tactique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chiffrer et Décoder',ch1Desc:'Chiffre un message puis essaie de le décoder manuellement sans regarder la clé. Quels motifs repères-tu dans le texte chiffré ?',ch2Title:'Test de Furtivité',ch2Desc:'Essaie de compléter la mission avec l\'empreinte signal la plus faible possible. Peux-tu descendre sous le seuil de détection ?',ch3Title:'Course à l\'Interception',ch3Desc:'Lance une transmission et mesure le temps de détection. Qu\'est-ce qui affecte ce délai ?',codeTitle:'Code de Démarrage',codeLang:'MicroPython (micro:bit)',codeSnippet:'from microbit import *\\nimport radio\\n\\nradio.on()\\nradio.config(group=42, power=7)\\n\\nwhile True:\\n msg = radio.receive()\\n if msg:\\n display.scroll(msg)\\n if button_a.was_pressed():\\n radio.send("HELLO")\\n display.show(Image.YES)',codeExplain:'Ce code active la radio du micro:bit sur le groupe 42 à pleine puissance. Quand le bouton A est pressé, il diffuse "HELLO". Tout message reçu défile sur l\'écran LED. Les numéros de groupe fonctionnent comme des canaux.',purpose:'Extraction Signal : Broadcast coded emergency extraction requests. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'esc-stylometry-defeater',related1_desc:'',related1_path:'../../55-escape-evasion/esc-stylometry-defeater/index.html',related2_name:'Réseau de Relais Oignon',related2_desc:'Construisez des circuits et envoyez des messages chiffrés via les relais',related2_path:'../../02-spy-esp32/esp-tor-relay/index.html',related3_name:'esc-forensic-evidence-planter',related3_desc:'',related3_path:'../../55-escape-evasion/esc-forensic-evidence-planter/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Interrupteur d\\',pathPrev_path:'../../40-agent-microbit/bit-dead-man-switch/index.html',pathNext_name:'Clôture Invisible — Sécurité Périmétrique',pathNext_path:'../../40-agent-microbit/bit-invisible-fence/index.html',
 printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Que signifie IA ?',quiz_q1a:'Entrée automatisée',quiz_q1b:'Intelligence Artificielle',quiz_q1c:'Interface analogique',quiz_q1d:'Intégration active',quiz_q1_answer:'1',quiz_q2:'En Morse, que représente la lettre E ?',quiz_q2a:'Trait',quiz_q2b:'Un point',quiz_q2c:'Deux points',quiz_q2d:'Point-trait',quiz_q2_answer:'1',quiz_q3:'Quelle unité mesure la puissance du signal ?',quiz_q3a:'Hertz',quiz_q3b:'Décibels (dBm)',quiz_q3c:'Watts uniquement',quiz_q3d:'Mètres',quiz_q3_answer:'1',quiz_q4:'Combien de LEDs a l\'écran du micro:bit ?',quiz_q4a:'16',quiz_q4b:'25',quiz_q4c:'36',quiz_q4d:'64',quiz_q4_answer:'1',quiz_q5:'Qui a inventé le code Morse ?',quiz_q5a:'Tesla',quiz_q5b:'Samuel Morse',quiz_q5c:'Edison',quiz_q5d:'Bell',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'affaire Aldrich Ames (1994) a révélé comment une taupe de la CIA utilisait des boîtes aux lettres mortes pour transmettre des renseignements classifiés à l\'Union soviétique pendant près d\'une décennie.',realworld2:'L\'opération Ivy Bells (1970-80) était une mission conjointe NSA/Marine pour intercepter les cbles de communication sous-marins soviétiques en mer d\'Okhotsk.',realworld3:'Les stations de nombres diffusent des messages chiffrés par ondes courtes aux agents de terrain depuis la Guerre froide. UVB-76 émet un bourdonnement monotone depuis 1982.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En opérations agent terrain, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en opérations agent terrain et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Extraction Signal illustre un concept fondamental en opérations agent terrain. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Extraction Signal ont des applications directes dans le monde réel. Les professionnels de opérations agent terrain utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, micro:bit et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en opérations agent terrain implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.',proTipTitle:'💡 Conseils de pro',proTip1:'Vérifiez toujours le niveau de batterie avant les opérations terrain. Un micro:bit mourant produit des lectures capteur peu fiables.',proTip2:'Utilisez des numéros de groupe radio supérieurs à 100 pour éviter les interférences. Les groupes par défaut 0-10 sont encombrés.',funFactTitle:'🎯 Le saviez-vous ?',funFact:'Pendant la Guerre froide, la CIA a construit une libellule robot dans les années 1970 pour transporter un microphone miniature. Le projet Insectothopter a été abandonné car il ne pouvait pas voler dans le vent.',mistakeTitle:'⚠️ Erreurs courantes',mistake1:'Changer plusieurs paramètres à la fois rend impossible l\x27isolation de la cause et de l\x27effet. Changez toujours UNE seule variable à la fois.',mistake2:'Sauter la mesure de référence. Sans connaître le comportement par défaut, vous ne pouvez pas mesurer l\x27impact de vos changements.',mistake3:'Ignorer le journal d\x27activité. Il enregistre chaque événement avec des horodatages — essentiel pour comprendre les séquences.'},
 wiki_history_title: '📜 Histoire de agents autonomes',
 wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Extraction Signal s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
 wiki_math_title: '📐 Mathématiques de Extraction Signal',
 wiki_math: 'Les mathématiques derrière Extraction Signal : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity.',
 wiki_advanced_title: '🔬 Techniques avancées',
 wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de agents autonomes utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
 wiki_compare_title: '⚖️ Comparaison des approches',
 wiki_compare: 'Il existe plusieurs approches pour agents autonomes. Les solutions matérielles avec BBC micro:bit offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
 wiki_debug_title: '🔧 Guide de dépannage',
 wiki_debug: 'Problèmes courants en agents autonomes : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
 wiki_ethics_title: '⚖️ Éthique et aspects légaux',
 wiki_ethics: 'Agents autonomes implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de BBC micro:bit. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
 gloss1_term: 'SNR',
 gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
 gloss2_term: 'Hertz (Hz)',
 gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
 gloss3_term: 'Beacon Interval',
 gloss3_def: 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
 gloss4_term: 'Latency',
 gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
 gloss5_term: 'Throughput',
 gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
 gloss6_term: 'Protocol',
 gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
 theoryTitle: '📖 Théorie et contexte',
 theory: 'Extraction Signal démontre les principes clés de agents autonomes. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
 faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
 faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
 faq_q10: 'Quel est le lien avec autonomous agents dans le monde réel ?',
 faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel BBC micro:bit et peuvent avoir des exigences légales.',
 glossTitle: '📚 Termes clés',
 ar: {
 
 ...LANG_BASE.ar,
 diffTitle:'المستوى',diffBeginner:'🟢 مبتدئ',diffIntermediate:'🟡 متوسط',diffExpert:'🔴 خبير',diffInfo:'اختر مستوى التعقيد',spacedTitle:'📅 المراجعة المتباعدة',spacedReview:'مراجعة',spacedNext:'المراجعة التالية',spacedMastered:'مُتقَن',spacedNew:'جديد — لم يُدرَس بعد',spacedDue:'حان وقت المراجعة!',spacedInfo:'تذكيرات ذكية بناءً على منحنى النسيان',
 
 missionTitle:'\u0625\u062D\u0627\u0637\u0629 \u0627\u0644\u0645\u0647\u0645\u0629',missionClassified:'\u0633\u0631\u064A',missionObjective:'\u0647\u062F\u0641 \u0627\u0644\u0645\u0647\u0645\u0629:',missionAgent:'AGENT-543353',missionSkip:'\u062A\u062E\u0637\u064A',missionGo:'\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0647\u0645\u0629',mission_obj:'\u0627\u0633\u062A\u0643\u0634\u0641 \u0648\u0623\u062A\u0642\u0646 \u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u2014 \u062D\u0644\u0644 \u0648\u062C\u0631\u0628 \u0648\u0623\u0643\u0645\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A.',nightVisionTitle:'\u0648\u0636\u0639 \u0627\u0644\u0631\u0624\u064A\u0629 \u0627\u0644\u0644\u064A\u0644\u064A\u0629',nightVisionOn:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 ON',nightVisionOff:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 OFF',nightVisionAuto:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A',
 termTitle:'>_ الطرفية',termPlaceholder:'اكتب أمراً...',termHelp:'الأوامر: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher',termUnknown:'أمر غير معروف. اكتب help للمساعدة.',termWelcome:'الطرفية جاهزة. اكتب help للبدء.',cipherTitle:'🔐 أدوات التشفير',cipherInput:'النص المدخل',cipherOutput:'النتيجة',cipherEncode:'تشفير',cipherDecode:'فك التشفير',cipherMethod:'الطريقة',cipherKey:'المفتاح',cipherCopy:'نسخ',
 
 particleTitle:'🎆 جزيئات',particleToggle:'تبديل الجزيئات',compareTitle:'📊 مقارنة',compareSave:'حفظ',compareLoad:'تحميل',compareDiff:'الفرق',compareClear:'مسح',compareSlotA:'تجربة أ',compareSlotB:'تجربة ب',compareResult:'نتيجة المقارنة',
 
 peerTitle:'👥 Mode Pair',peerConnect:'Connecter',peerDisconnect:'D\xe9connecter',peerStatus:'Statut pair',peerSend:'Envoy\xe9',peerReceive:'Re\xe7u',peerInfo:'Ouvrez cette app dans deux onglets pour synchroniser les param\xe8tres',heatmapTitle:'📅 Carte d\x27activit\xe9',heatmapToday:'Aujourd\x27hui',heatmapStreak:'S\xe9rie',heatmapTotal:'Total',heatmapLegend:'Moins \u2192 Plus',
 
 labTitle:'📓 دفتر المختبر',labGenerate:'📓 تقرير المختبر',labExport:'تصدير التقرير',labHypothesis:'الفرضية',labMethod:'المنهجية',labObservation:'الملاحظات',labConclusion:'الخلاصة',labSession:'الجلسة',recorderTitle:' مسجل البيانات',recorderStart:' تسجيل',recorderStop:' إيقاف',recorderClear:'مسح',recorderExport:'تصدير CSV',recorderPoints:'نقطة',recorderGraph:'رسم بياني',
 voiceTitle:'🎤 صوت',voiceOn:'الصوت مفعل',voiceOff:'الصوت معطل',voiceListening:'جاري الاستماع...',voiceCmd:'تم التعرف على الأمر',voiceHelp:'قل: ابدأ، توقف، مساعدة',voice_cmds:'ابدأ / توقف / مساعدة',shareTitle:'📤 مشاركة',shareBtn:'📤 مشاركة',shareCopied:'تم النسخ!',shareGenerate:'إنشاء ملخص',shareExport:'تصدير JSON',
 
 
 dailyTitle:'📅 تحدي اليوم',dailyChallenge:'تحدي اليوم',dailyHint:'إظهار التلميح',dailyStreak:'سلسلة',dailyComplete:'إكمال',daily_d1:'اشرح كيف يعمل هذا التطبيق لصديق في أقل من 60 ثانية.',daily_d2:'ابحث عن 3 تطبيقات واقعية للمفاهيم المعروضة هنا.',daily_d3:'غيّر معلمة واحدة إلى قيمتها القصوى ووثّق ما يحدث.',daily_d4:'ارسم مخططاً يوضح تدفق البيانات في هذه المحاكاة.',daily_d5:'اكتب الكود الزائف للخوارزمية الرئيسية المستخدمة في هذا التطبيق.',daily_d6:'قارن النتائج بالإعدادات الافتراضية والمعدلة ولاحظ 3 اختلافات.',daily_d7:'ضع فرضية حول ما يحدث إذا ضاعفت المعلمة الرئيسية ثم اختبرها.',mentorTitle:'🎓 دليل تعليمي',mentorStart:'بدء الدليل',mentorNext:'التالي',mentorPrev:'السابق',mentorDone:'إنهاء',mentorStep:'خطوة',mentor_s1:'انظر إلى منطقة العرض الرئيسية — هنا تعمل المحاكاة في الوقت الفعلي.',mentor_s2:'اضغط على ابدأ لتشغيل المحاكاة. راقب كيف يتفاعل العرض.',mentor_s3:'جرّب تعديل شريط تمرير واحد — لاحظ كيف يؤثر على النتيجة فوراً.',mentor_s4:'افتح لوحة المساعدة واستكشف تبويب الويكي لمعرفة أعمق.',mentor_s5:'أكمل تحدياً واحداً لاختبار فهمك للمفاهيم.',
 sonifyTitle:'🔊 تحويل البيانات إلى صوت',sonifyOn:'الصوت مُفعَل',sonifyOff:'الصوت مُعطَل',sonifyFreq:'التردد',sonifyVol:'الصوت',sonifyWave:'شكل الموجة',sonifyInfo:'حوّل البيانات إلى صوت',
 tooltipTitle:'تلميحات ذكية',tooltipToggle:'تبديل التلميحات',tip_start:'ابدأ المحاكاة وشاهد الرسم البياني ينبض بالحياة',tip_stop:'أوقف المحاكاة مؤقتاً مع الحفاظ على الحالة الحالية',tip_reset:'امسح جميع البيانات وعد إلى الشروط الأولية',tip_slider:'اسحب لضبط هذا المعامل — يتحدث الرسم البياني في الوقت الفعلي',tip_theme:'بدّل بين 8 مظاهر مرئية منها تصميمان إسلاميان فاتحان',tip_help:'افتح لوحة المساعدة مع الأسئلة الشائعة والأدلة والويكي والتحديات',explorerTitle:'مستكشف فضاء المعاملات',explorerStart:'استكشاف تلقائي',explorerStop:'إيقاف الاستكشاف',explorerProgress:'جارٍ استكشاف التوليفات...',explorerResult:'اكتمل الاستكشاف',explorerInfo:'يختبر بشكل منهجي الحد الأدنى/الوسط/الأقصى لكل منزلق ويسجل النتائج',
 
 title: 'Extraction Signal', subtitle: '🚁 إشارة الاستخراج — منارة الطوارئ',
 disconnected: 'غير متصل', connected: 'متصل',
 mainSection: 'إشارة الاستخراج — منارة الطوارئ', mainDesc: 'بث طلبات استخراج طوارئ مشفرة',
 sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
 activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
 clear: 'مسح', copy: 'نسخ', theme: 'المظهر',
 settings: '⚙️ الإعدادات', language: 'اللغة',
 helpSettings: '❓ مساعدة وإعدادات', settingsTab: '⚙️',
 help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
 howto_1:'تعرض الشاشة الرئيسية محاكاة Extraction Signal. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Encode agent ID, status, and location into a compact binary ',
 howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
 howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
 howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
 wiki_beacons_title: '🚨 منارات الطوارئ', wiki_beacons: 'منارات الطوارئ (ELT، PLB، EPIRB) هي أجهزة تبث إشارات استغاثة على 406 ميغاهرتز إلى أقمار COSPAS-SARSAT للبحث والإنقاذ.',
 wiki_elt_title: '🛩️ ELT / PLB', wiki_elt: 'ELT (محدد موقع الطوارئ) للطائرات. PLB (منارة تحديد الموقع الشخصية) محمولة. كلاهما يشفر معرفًا فريدًا وإحداثيات GPS.',
 wiki_encoding_title: '🔢 تشفير الإشارة', wiki_encoding: 'تشفر إشارات الطوارئ الهوية والموقع والحالة في إطارات ثنائية مضغوطة باستخدام تعبئة البتات والمجموع التحقق وأكواد التصحيح.',
 wiki_rescue_title: '🚁 بروتوكولات الإنقاذ', wiki_rescue: 'تحدد بروتوكولات الإنقاذ فرز الأولوية (روتيني، عاجل، حرج، MAYDAY) وأوقات الاستجابة وإجراءات التأكيد لعمليات الاستخراج.',
 working: 'جارٍ…',
 t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
 t_riad: 'رياض', t_medina: 'مدينة',
 t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
 ready: '🚁 نظام منارة الاستخراج جاهز!',
 logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
 export: 'تصدير', filterAll: 'الكل',
 soundEffects: '🔊 مؤثرات صوتية',
 whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
 musicMode: 'تفاعل موسيقي', chatPlaceholder: 'تحدث مع الروبوت...',
 splashHint: 'انقر للتخطي',
 newVersion: 'تحديث',
 langChanged: '🌐 اللغة ← العربية',
 themeChanged: '🎨 المظهر ←',
 beaconLabel: 'حالة المنارة',
 standby: 'استعداد', broadcasting: 'بث', acknowledged: 'تم التأكيد',
 priorityLabel: 'مستوى الأولوية',
 priorityLow: 'منخفض (روتيني)', priorityMedium: 'متوسط (عاجل)', priorityHigh: 'عالي (حرج)', priorityMayday: 'MAYDAY',
 agentIdLabel: 'معرف العميل', statusLabel: 'الحالة', gridLabel: 'إحداثيات الشبكة',
 statusOk: 'بخير', statusInjured: 'مصاب', statusCompromised: 'مكشوف', statusUnderfire: 'تحت النار',
 activateBtn: 'تفعيل المنارة', cancelBtn: 'إلغاء',
 frameLabel: 'حزمة الطوارئ المشفرة',
 beaconActivated: '🚨 المنارة مفعلة — البث على تردد الطوارئ',
 beaconCancelled: '🔴 تم إلغاء المنارة — العودة للاستعداد',
 rescueAck: '🚁 تأكيد الإنقاذ — فريق الاستخراج في الطريق!',
 txFrame: '📡 إطار TX:',
 repeatBroadcast: '📡 إعادة بث #',
 fillRequired: '⚠️ املأ معرف العميل والإحداثيات',
 howItWorks1: 'تشفير معرف العميل والحالة والموقع في إطار ثنائي مضغوط.',
 howItWorks2: 'المنارة تبث الإطار على تردد الطوارئ.',
 howItWorks3: 'الإشارة تتكرر كل N ثانية (أسرع للأولوية الأعلى).',
 howItWorks4: 'فريق الإنقاذ يستقبل ويفك التشفير ويؤكد استلام المنارة.',
 lab1: 'بناء رسائل طوارئ مختلفة ومراقبة الإطارات المشفرة.',
 lab2: 'مقارنة مستويات الأولوية: لاحظ تغير سرعة ولون النبض.',
 lab3: 'فك تشفير منارة مُعترضة: الصق الهكس في معرف العميل ولاحظ.',
 lab4: 'قياس وقت الاستجابة: فعّل وراقب مؤقت تأكيد الإنقاذ.',
 challenge1: 'تشفير إشارة MAYDAY باستخدام أقل عدد ممكن من البايتات.',
 challenge2: 'فك تشفير إطار منارة مجهول: ما العميل والحالة والموقع الذي يحتويه؟',
 challenge3: 'تصميم بروتوكول استخراج خفي يقلل من قابلية كشف الإشارة.',step1Title:'تجهيز',step1Desc:'Encode agent ID, status, and location into a compact binary frame. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'نشر',step2Desc:'The beacon transmits the frame on the emergency frequency. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'مراقبة',step3Desc:'The signal repeats every N seconds (faster for higher priority). تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'استخراج',step4Desc:'The rescue team receives, decodes, and acknowledges the beacon. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Extraction Signal؟',faq_a1:'Extraction Signal هي محاكاة تفاعلية توضح مفاهيم الوكلاء المستقلون. Broadcast coded emergency extraction requests. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الاتصالات التكتيكية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الاتصالات التكتيكية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج RPi + micro:bit. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الاتصالات التكتيكية.',demo_s1:'مرحباً في Extraction Signal! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الاتصالات التكتيكية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالاتصالات التكتيكية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Field Equipment',learn1Desc:'How agents select and configure mission gear. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Tradecraft',learn2Title:'Covert Comms',learn2Desc:'How to set up secure communication channels. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'COMSEC',learn3Title:'Surveillance',learn3Desc:'How to monitor areas and detect threats. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Intel',learn4Title:'Extraction',learn4Desc:'How to collect and secure intelligence safely. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Operations',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Extraction Signal! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالوكلاء المستقلون — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Encode agent ID, status, and location into a compa لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الاتصالات التكتيكية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تشفير وفك تشفير',ch1Desc:'شفّر رسالة ثم حاول فك تشفيرها يدوياً بدون النظر للمفتاح. ما الأنماط التي تلاحظها؟',ch2Title:'اختبار التخفي',ch2Desc:'حاول إكمال المهمة بأقل بصمة إشارة ممكنة. هل يمكنك النزول تحت عتبة الكشف؟',ch3Title:'سباق الاعتراض',ch3Desc:'ابدأ بثاً وقِس سرعة اعتراضه. ما الذي يؤثر على وقت الكشف؟',codeTitle:'كود البداية',codeLang:'MicroPython (micro:bit)',codeSnippet:'from microbit import *\\nimport radio\\n\\nradio.on()\\nradio.config(group=42, power=7)\\n\\nwhile True:\\n msg = radio.receive()\\n if msg:\\n display.scroll(msg)\\n if button_a.was_pressed():\\n radio.send("HELLO")\\n display.show(Image.YES)',codeExplain:'يشغّل هذا الكود راديو micro:bit على المجموعة 42 بأقصى طاقة. عند الضغط على الزر A يبث "HELLO". أي رسالة مستلمة تمرر على شاشة LED.',purpose:'Extraction Signal: Broadcast coded emergency extraction requests. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
 wiki_history_title: '📜 تاريخ الوكلاء المستقلون',
 wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Extraction Signal على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
 wiki_math_title: '📐 الرياضيات وراء Extraction Signal',
 wiki_math: 'الرياضيات وراء Extraction Signal: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity.',
 wiki_advanced_title: '🔬 تقنيات متقدمة',
 wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الوكلاء المستقلون المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
 wiki_compare_title: '⚖️ مقارنة الأساليب',
 wiki_compare: 'هناك عدة أساليب في الوكلاء المستقلون. توفر الحلول المادية باستخدام BBC micro:bit أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
 wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
 wiki_debug: 'مشاكل شائعة في الوكلاء المستقلون: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
 wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
 wiki_ethics: 'الوكلاء المستقلون يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام BBC micro:bit والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
 gloss1_term: 'SNR',
 gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
 gloss2_term: 'Hertz (Hz)',
 gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
 gloss3_term: 'Beacon Interval',
 gloss3_def: 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
 gloss4_term: 'Latency',
 gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
 gloss5_term: 'Throughput',
 gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
 gloss6_term: 'Protocol',
 gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
 theoryTitle: '📖 النظرية والخلفية',
 theory: 'Extraction Signal يوضح المبادئ الأساسية في الوكلاء المستقلون. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
 faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
 faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
 faq_q10: 'كيف يرتبط هذا بـautonomous agents في العالم الحقيقي؟',
 faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة BBC micro:bit وقد تتطلب تراخيص قانونية للتشغيل.',
 glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'esc-stylometry-defeater',related1_desc:'',related1_path:'../../55-escape-evasion/esc-stylometry-defeater/index.html',related2_name:'شبكة مرحلات البصل',related2_desc:'ابنِ دوائر وأرسل رسائل مشفرة عبر عقد الترحيل',related2_path:'../../02-spy-esp32/esp-tor-relay/index.html',related3_name:'esc-forensic-evidence-planter',related3_desc:'',related3_path:'../../55-escape-evasion/esc-forensic-evidence-planter/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مفتاح الرجل الميت — مراقب الحركة',pathPrev_path:'../../40-agent-microbit/bit-dead-man-switch/index.html',pathNext_name:'السياج الخفي — أمن المحيط',pathNext_path:'../../40-agent-microbit/bit-invisible-fence/index.html',
 printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ماذا تعني AI؟',quiz_q1a:'إدخال آلي',quiz_q1b:'الذكاء الاصطناعي',quiz_q1c:'واجهة تناظرية',quiz_q1d:'تكامل نشط',quiz_q1_answer:'1',quiz_q2:'في شيفرة مورس، ما يمثل الحرف E؟',quiz_q2a:'شرطة',quiz_q2b:'نقطة واحدة',quiz_q2c:'نقطتان',quiz_q2d:'نقطة-شرطة',quiz_q2_answer:'1',quiz_q3:'ما الوحدة الشائعة لقياس قوة الإشارة؟',quiz_q3a:'هرتز',quiz_q3b:'ديسيبل (dBm)',quiz_q3c:'واط فقط',quiz_q3d:'أمتار',quiz_q3_answer:'1',quiz_q4:'كم عدد مصابيح LED في شاشة micro:bit؟',quiz_q4a:'16',quiz_q4b:'25',quiz_q4c:'36',quiz_q4d:'64',quiz_q4_answer:'1',quiz_q5:'من اخترع شيفرة مورس؟',quiz_q5a:'تسلا',quiz_q5b:'صامويل مورس',quiz_q5c:'إديسون',quiz_q5d:'بيل',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'كشفت قضية ألدريتش أيمز (1994) كيف استخدم عميل مزدوج نقاط التسليم السرية لنقل معلومات استخبارية مصنفة للاتحاد السوفيتي لمدة عقد تقريبًا.',realworld2:'كانت عملية آيفي بيلز في السبعينيات والثمانينيات مهمة مشتركة بين وكالة الأمن القومي والبحرية للتنصت على كابلات الاتصالات السوفيتية تحت البحر.',realworld3:'تبث محطات الأرقام رسائل مشفرة عبر الموجات القصيرة للعملاء الميدانيين منذ الحرب الباردة.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في عمليات العملاء معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في عمليات العملاء وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Extraction Signal يوضح مفهومًا أساسيًا في عمليات العملاء. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Extraction Signal لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في عمليات العملاء هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ micro:bit وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال عمليات العملاء يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.',proTipTitle:'💡 نصائح احترافية',proTip1:'تحقق دائمًا من مستوى البطارية قبل العمليات الميدانية. ينتج micro:bit الذي تنفد بطاريته قراءات مستشعر غير موثوقة.',proTip2:'استخدم أرقام مجموعات الراديو فوق 100 لتجنب التداخل مع مستخدمي micro:bit الآخرين. المجموعات الافتراضية 0-10 مزدحمة.',funFactTitle:'🎯 هل تعلم؟',funFact:'خلال الحرب الباردة، بنت وكالة المخابرات المركزية يعسوبًا آليًا في السبعينيات لحمل ميكروفون مصغر. تم التخلي عن المشروع لأنه لم يستطع الطيران في الرياح.',mistakeTitle:'⚠️ أخطاء شائعة',mistake1:'تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.',mistake2:'تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.',peerTitle:'👥 \u0648\u0636\u0639 \u0627\u0644\u0646\u0638\u064a\u0631',peerConnect:'\u0627\u062a\u0635\u0627\u0644',peerDisconnect:'\u0642\u0637\u0639',peerStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0638\u064a\u0631',peerSend:'\u0623\u0631\u0633\u0644',peerReceive:'\u0627\u0633\u062a\u0644\u0645',peerInfo:'\u0627\u0641\u062a\u062d \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0641\u064a \u062a\u0628\u0648\u064a\u0628\u064a\u0646 \u0644\u0644\u0645\u0632\u0627\u0645\u0646\u0629',heatmapTitle:'📅 \u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0646\u0634\u0627\u0637',heatmapToday:'\u0627\u0644\u064a\u0648\u0645',heatmapStreak:'\u0633\u0644\u0633\u0644\u0629',heatmapTotal:'\u0627\u0644\u0645\u062c\u0645\u0648\u0639',heatmapLegend:'\u0623\u0642\u0644 \u2192 \u0623\u0643\u062b\u0631',mistake3:'تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.'}

};

/* ═══════ Difficulty Levels ═══════ */
function initDifficultyLevels(){
 if(document.getElementById('diffToggleBar'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='diff_'+appDir;
 var saved=localStorage.getItem(storageKey)||'intermediate';
 /* inject CSS */
 var style=document.createElement('style');
 style.textContent=''
 +'.diff-beginner .sim-controls input[type="range"]:nth-of-type(n+4),.diff-beginner .sim-controls .slider-row:nth-of-type(n+4){display:none !important;}'
 +'.diff-beginner label,.diff-beginner .sidebar-label{font-size:1rem !important;}'
 +'.diff-beginner .card-subtitle{font-size:0.95rem !important;}'
 +'.diff-expert{font-size:0.88rem;}'
 +'.diff-expert .card,.diff-expert .collapsible{padding:0.5rem !important;}'
 +'.diff-expert .card-header{padding:0.4rem 0.5rem !important;}'
 +'.diff-toggle-bar{display:flex;gap:0.4rem;align-items:center;padding:0.4rem 0.6rem;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);margin-bottom:0.5rem;flex-wrap:wrap;}'
 +'.diff-toggle-bar button{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;transition:all 0.2s;}'
 +'.diff-toggle-bar button.active{background:var(--accent,#d4a03c);color:var(--bg,#08091a);font-weight:700;border-color:var(--accent,#d4a03c);}'
 +'.diff-toggle-bar .diff-label{font-size:0.75rem;opacity:0.6;margin-right:0.3rem;}'
 +'#diffExpertData{display:none;margin:0.5rem 0;padding:0.6rem;border-radius:8px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:0.7rem;color:#8f8;max-height:120px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;}'
 +'.diff-expert #diffExpertData{display:block;}';
 document.head.appendChild(style);
 /* build toggle bar */
 var bar=document.createElement('div');
 bar.id='diffToggleBar';
 bar.className='diff-toggle-bar';
 bar.innerHTML='<span class="diff-label" data-i18n="diffTitle">'+(L.diffTitle||'Difficulty')+'</span>'
 +'<button data-diff="beginner" data-i18n="diffBeginner">'+(L.diffBeginner||'🟢 Beginner')+'</button>'
 +'<button data-diff="intermediate" data-i18n="diffIntermediate">'+(L.diffIntermediate||'🟡 Intermediate')+'</button>'
 +'<button data-diff="expert" data-i18n="diffExpert">'+(L.diffExpert||'🔴 Expert')+'</button>'
 +'<span style="font-size:0.65rem;opacity:0.4;margin-left:auto;" data-i18n="diffInfo">'+(L.diffInfo||'Choose your complexity level')+'</span>';
 var header=document.querySelector('.header');
 if(header&&header.parentNode){header.parentNode.insertBefore(bar,header.nextSibling);}
 else{var app=document.querySelector('.app')||document.body;app.insertBefore(bar,app.firstChild);}
 /* expert data readout */
 var expertDiv=document.createElement('div');
 expertDiv.id='diffExpertData';
 var mainCard=document.getElementById('mainCard');
 if(mainCard&&mainCard.parentNode){mainCard.parentNode.insertBefore(expertDiv,mainCard.nextSibling);}
 function setDiff(level){
 document.body.classList.remove('diff-beginner','diff-intermediate','diff-expert');
 document.body.classList.add('diff-'+level);
 bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-diff')===level);});
 localStorage.setItem(storageKey,level);
 if(level==='beginner'){
 var hw=document.querySelector('details.collapsible');
 if(hw&&!hw.open)hw.open=true;
 }
 if(level==='expert'){updateExpertData();}
 else{expertDiv.textContent='';}
 }
 function updateExpertData(){
 if(!document.body.classList.contains('diff-expert'))return;
 var data={};
 document.querySelectorAll('input[type="range"]').forEach(function(s){
 var label=s.previousElementSibling?s.previousElementSibling.textContent:s.id;
 data[label||s.id||'slider']=parseFloat(s.value).toFixed(4);
 });
 document.querySelectorAll('select').forEach(function(s){
 if(s.id!=='langSelect'&&s.id!=='themeSelect'){
 data[s.id||'select']=s.value;
 }
 });
 expertDiv.textContent=JSON.stringify(data,null,2);
 }
 bar.addEventListener('click',function(e){
 var btn=e.target.closest('button[data-diff]');
 if(btn)setDiff(btn.getAttribute('data-diff'));
 });
 setDiff(saved);
 /* update expert readout periodically */
 setInterval(function(){if(document.body.classList.contains('diff-expert'))updateExpertData();},2000);
 /* listen for slider changes */
 document.addEventListener('input',function(e){if(e.target.type==='range'&&document.body.classList.contains('diff-expert'))updateExpertData();});
}

/* ═══════ Spaced Repetition ═══════ */
function initSpacedRepetition(){
 if(document.getElementById('spacedPanel'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='spaced_'+appDir;
 var now=Date.now();
 var DAY=86400000;
 /* load or create record */
 var rec;
 try{rec=JSON.parse(localStorage.getItem(storageKey));}catch(e){rec=null;}
 if(!rec){rec={visits:0,lastVisit:0,interval:1,ease:2.5};}
 /* SM-2 inspired update */
 var timeSinceLast=now-rec.lastVisit;
 var intervalMs=rec.interval*DAY;
 if(rec.visits===0){
 rec.interval=1;
 }else if(rec.visits===1){
 rec.interval=3;
 }else{
 if(timeSinceLast<intervalMs*0.5){
 /* visited too early, keep interval */
 }else if(timeSinceLast>intervalMs){
 /* visited late, reduce ease slightly */
 rec.ease=Math.max(1.3,rec.ease-0.15);
 rec.interval=Math.round(rec.interval*rec.ease);
 }else{
 rec.interval=Math.round(rec.interval*rec.ease);
 }
 }
 rec.visits++;
 rec.lastVisit=now;
 localStorage.setItem(storageKey,JSON.stringify(rec));
 /* determine status */
 var nextReviewMs=rec.lastVisit+rec.interval*DAY;
 var status,statusIcon,statusClass;
 if(rec.visits<=1){
 status=L.spacedNew||'New — not yet studied';statusIcon='⚪';statusClass='spaced-new';
 }else if(now>nextReviewMs){
 status=L.spacedDue||'Due for review!';statusIcon='🔴';statusClass='spaced-due';
 }else if(nextReviewMs-now<DAY){
 status=(L.spacedNext||'Next review')+': '+(L.spacedReview||'Review')+' — tomorrow';statusIcon='🟡';statusClass='spaced-soon';
 }else{
 var daysLeft=Math.ceil((nextReviewMs-now)/DAY);
 status=(L.spacedMastered||'Mastered')+' — '+(L.spacedNext||'Next review')+''+daysLeft+' days';statusIcon='🟢';statusClass='spaced-mastered';
 }
 /* scan other apps for due reviews */
 var totalVisited=0,dueCount=0,masteredCount=0;
 var dueApps=[];
 for(var i=0;i<localStorage.length;i++){
 var key=localStorage.key(i);
 if(key&&key.indexOf('spaced_')===0){
 try{
 var other=JSON.parse(localStorage.getItem(key));
 if(other&&other.visits>0){
 totalVisited++;
 var otherNext=other.lastVisit+other.interval*DAY;
 if(now>otherNext){
 dueCount++;
 dueApps.push(key.replace('spaced_',''));
 }else{
 masteredCount++;
 }
 }
 }catch(e){}
 }
 }
 /* inject CSS */
 var style=document.createElement('style');
 style.textContent=''
 +'#spacedPanel{padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);}'
 +'#spacedPanel h4{margin:0 0 0.4rem;font-size:0.9rem;}'
 +'.spaced-status{display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.85rem;}'
 +'.spaced-status .spaced-icon{font-size:1.1rem;}'
 +'.spaced-summary{display:flex;gap:1rem;flex-wrap:wrap;margin:0.5rem 0;font-size:0.75rem;opacity:0.7;}'
 +'.spaced-summary span{white-space:nowrap;}'
 +'.spaced-due-list{margin-top:0.5rem;font-size:0.75rem;max-height:80px;overflow-y:auto;}'
 +'.spaced-due-list a{color:var(--accent,#d4a03c);text-decoration:none;margin-right:0.5rem;}'
 +'.spaced-due-list a:hover{text-decoration:underline;}'
 +'#spacedMarkBtn{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid var(--accent,#d4a03c);background:rgba(var(--accent-rgb,212,175,55),0.15);color:inherit;cursor:pointer;font-size:0.78rem;margin-top:0.4rem;}'
 +'#spacedMarkBtn:hover{background:rgba(var(--accent-rgb,212,175,55),0.3);}';
 document.head.appendChild(style);
 /* build panel */
 var panel=document.createElement('div');
 panel.id='spacedPanel';
 var dueLinksHtml='';
 if(dueApps.length>0){
 dueLinksHtml='<div class="spaced-due-list"><strong>'+(L.spacedDue||'Due for review!')+'</strong><br>';
 dueApps.slice(0,8).forEach(function(d){
 dueLinksHtml+='<a href="../../'+d+'/index.html" title="'+d+'">'+d+'</a> ';
 });
 if(dueApps.length>8)dueLinksHtml+='<span>... +'+(dueApps.length-8)+' more</span>';
 dueLinksHtml+='</div>';
 }
 panel.innerHTML='<h4 data-i18n="spacedTitle">'+(L.spacedTitle||'📅 Spaced Review')+'</h4>'
 +'<div class="spaced-status"><span class="spaced-icon">'+statusIcon+'</span><span>'+status+'</span></div>'
 +'<div class="spaced-summary">'
 +'<span>📚 '+totalVisited+' visited</span>'
 +'<span>🔴 '+dueCount+' due</span>'
 +'<span>🟢 '+masteredCount+' on track</span>'
 +'</div>'
 +'<button id="spacedMarkBtn" data-i18n="spacedReview">✅ '+(L.spacedReview||'Mark as Reviewed')+'</button>'
 +dueLinksHtml
 +'<div style="font-size:0.65rem;opacity:0.4;margin-top:0.4rem;" data-i18n="spacedInfo">'+(L.spacedInfo||'Smart review reminders based on the forgetting curve')+'</div>';
 /* insert near sidebar footer or after last collapsible */
 var target=document.querySelector('.sidebar-footer');
 if(target&&target.parentNode){
 target.parentNode.insertBefore(panel,target);
 }else{
 var lastDetails=document.querySelectorAll('details.collapsible');
 if(lastDetails.length>0){
 var ld=lastDetails[lastDetails.length-1];
 ld.parentNode.insertBefore(panel,ld.nextSibling);
 }else{
 var app=document.querySelector('.app')||document.body;
 app.appendChild(panel);
 }
 }
 /* mark as reviewed button */
 var markBtn=document.getElementById('spacedMarkBtn');
 if(markBtn){
 markBtn.addEventListener('click',function(){
 rec.lastVisit=Date.now();
 if(rec.visits>=3){
 rec.interval=Math.round(rec.interval*rec.ease);
 rec.ease=Math.min(3.0,rec.ease+0.1);
 }
 localStorage.setItem(storageKey,JSON.stringify(rec));
 markBtn.textContent='✅ '+(L.spacedMastered||'Reviewed!');
 markBtn.disabled=true;
 markBtn.style.opacity='0.5';
 });
 }
}

document.addEventListener('DOMContentLoaded',function(){try{initDifficultyLevels();}catch(e){console.warn('Difficulty init:',e);}try{initSpacedRepetition();}catch(e){console.warn('Spaced init:',e);}});



/* ═══════ Mini Terminal ═══════ */
function initTerminal(){
 if(document.getElementById('miniTerminal')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var visible=false, history=[], histIdx=-1, MAX_LINES=100;
 var wrap=document.createElement('div');wrap.id='miniTerminal';
 wrap.style.cssText='position:fixed;bottom:0;left:0;right:0;height:260px;background:#0a0a0a;border-top:2px solid #0f0;z-index:99999;display:none;flex-direction:column;font-family:monospace;font-size:13px;transition:transform 0.25s ease;transform:translateY(100%);';
 var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-bottom:1px solid #0f0;color:#0f0;';
 hdr.innerHTML='<span style="flex:1;font-weight:bold;" data-i18n="termTitle">'+(L.termTitle||'>_ Terminal')+'</span><button id="termCloseBtn" style="background:none;border:none;color:#0f0;font-size:18px;cursor:pointer;">\u2715</button>';
 var out=document.createElement('div');out.id='termOutput';out.style.cssText='flex:1;overflow-y:auto;padding:8px 10px;color:#0f0;white-space:pre-wrap;word-break:break-all;';
 var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-top:1px solid #222;';
 row.innerHTML='<span style="color:#0f0;margin-right:6px;">$</span>';
 var inp=document.createElement('input');inp.id='termInput';inp.type='text';inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');inp.placeholder=L.termPlaceholder||'Type a command...';
 inp.style.cssText='flex:1;background:transparent;border:none;outline:none;color:#0f0;font-family:monospace;font-size:13px;caret-color:#0f0;';
 row.appendChild(inp);wrap.appendChild(hdr);wrap.appendChild(out);wrap.appendChild(row);document.body.appendChild(wrap);
 var togBtn=document.createElement('button');togBtn.id='termToggleBtn';togBtn.textContent='>_';togBtn.title='Terminal';
 togBtn.style.cssText='position:fixed;bottom:10px;right:10px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#111;color:#0f0;border:1px solid #0f0;font-family:monospace;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
 togBtn.onmouseenter=function(){this.style.opacity='1';};togBtn.onmouseleave=function(){this.style.opacity='0.7';};
 document.body.appendChild(togBtn);
 function show(){wrap.style.display='flex';setTimeout(function(){wrap.style.transform='translateY(0)';},10);visible=true;inp.focus();}
 function hide(){wrap.style.transform='translateY(100%)';setTimeout(function(){wrap.style.display='none';},260);visible=false;}
 function toggle(){visible?hide():show();}
 togBtn.addEventListener('click',toggle);
 document.getElementById('termCloseBtn').addEventListener('click',hide);
 document.addEventListener('keydown',function(e){if(e.key==='`'&&!e.ctrlKey&&!e.altKey&&document.activeElement!==inp&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();toggle();}});
 function appendLine(txt,color){
 var d=document.createElement('div');d.style.color=color||'#0f0';d.textContent=txt;out.appendChild(d);
 while(out.children.length>MAX_LINES)out.removeChild(out.firstChild);
 out.scrollTop=out.scrollHeight;
 }
 appendLine(L.termWelcome||'Terminal ready. Type help to get started.','#0f0');
 function exec(cmd){
 cmd=cmd.trim();if(!cmd)return;
 history.push(cmd);histIdx=history.length;
 appendLine('> '+cmd,'#888');
 var parts=cmd.split(/\s+/),c=parts[0].toLowerCase(),args=parts.slice(1);
 switch(c){
 case 'help':appendLine(L.termHelp||'Commands: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher','#0f0');break;
 case 'start':if(typeof window.startSim==='function'){window.startSim();appendLine('Simulation started.','#0f0');}else{var sb=document.querySelector('[onclick*="start"]')||document.getElementById('startBtn');if(sb){sb.click();appendLine('Start triggered.','#0f0');}else appendLine('No start function found.','#f44');}break;
 case 'stop':if(typeof window.stopSim==='function'){window.stopSim();appendLine('Simulation stopped.','#0f0');}else{var sb2=document.querySelector('[onclick*="stop"]')||document.getElementById('stopBtn');if(sb2){sb2.click();appendLine('Stop triggered.','#0f0');}else appendLine('No stop function found.','#f44');}break;
 case 'reset':if(typeof window.resetSim==='function'){window.resetSim();appendLine('Simulation reset.','#0f0');}else{var sb3=document.querySelector('[onclick*="reset"]')||document.getElementById('resetBtn');if(sb3){sb3.click();appendLine('Reset triggered.','#0f0');}else appendLine('No reset function found.','#f44');}break;
 case 'theme':if(args[0]&&typeof window.setTheme==='function'){window.setTheme(args[0]);appendLine('Theme set to '+args[0],'#0f0');}else if(!args[0]){appendLine('Usage: theme [name] — mosque, zellige, andalus, riad, medina, space, jungle, robot','#ff0');}else{appendLine('setTheme not available.','#f44');}break;
 case 'lang':if(args[0]&&/^(en|fr|ar)$/.test(args[0])){document.documentElement.lang=args[0];if(typeof window.applyLang==='function')window.applyLang(args[0]);appendLine('Language set to '+args[0],'#0f0');}else{appendLine('Usage: lang [en|fr|ar]','#ff0');}break;
 case 'set':if(args.length>=2){var sliders=document.querySelectorAll('input[type=range]');var found=false;sliders.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){s.value=parseFloat(args[1]);s.dispatchEvent(new Event('input',{bubbles:true}));found=true;appendLine('Set '+args[0]+' = '+args[1],'#0f0');}});if(!found)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: set [param] [value]','#ff0');}break;
 case 'get':if(args[0]){var sliders2=document.querySelectorAll('input[type=range]');var found2=false;sliders2.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){appendLine(args[0]+' = '+s.value,'#0f0');found2=true;}});if(!found2)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: get [param]','#ff0');}break;
 case 'list':var sliders3=document.querySelectorAll('input[type=range]');if(sliders3.length===0){appendLine('No parameters found.','#ff0');}else{sliders3.forEach(function(s){var lbl=(s.previousElementSibling?s.previousElementSibling.textContent:s.parentElement?s.parentElement.textContent:'?').trim().substring(0,40);appendLine(''+lbl+' = '+s.value,'#0f0');});}break;
 case 'export':if(typeof window.exportLog==='function'){window.exportLog();appendLine('Export triggered.','#0f0');}else{appendLine('No export function available.','#f44');}break;
 case 'clear':out.innerHTML='';break;
 case 'status':var st=document.getElementById('statusText');appendLine('Status: '+(st?st.textContent:'unknown'),'#0f0');var sliders4=document.querySelectorAll('input[type=range]');appendLine('Parameters: '+sliders4.length,'#0f0');appendLine('Language: '+(document.documentElement.lang||'en'),'#0f0');break;
 case 'about':var ti=document.querySelector('[data-i18n="title"]');appendLine('App: '+(ti?ti.textContent:'Unknown'),'#0f0');appendLine('Framework: Vanilla JS + HTML5 Canvas','#0f0');appendLine('Trilingual: EN / FR / AR','#0f0');break;
 case 'cipher':if(typeof window.toggleCipherToolkit==='function'){window.toggleCipherToolkit();appendLine('Cipher toolkit opened.','#0f0');}else{appendLine('Cipher toolkit not available.','#f44');}break;
 default:appendLine(L.termUnknown||'Unknown command. Type help for available commands.','#f44');
 }
 }
 inp.addEventListener('keydown',function(e){
 if(e.key==='Enter'){exec(inp.value);inp.value='';}
 else if(e.key==='ArrowUp'){e.preventDefault();if(histIdx>0){histIdx--;inp.value=history[histIdx];}}
 else if(e.key==='ArrowDown'){e.preventDefault();if(histIdx<history.length-1){histIdx++;inp.value=history[histIdx];}else{histIdx=history.length;inp.value='';}}
 });
}
document.addEventListener('DOMContentLoaded',function(){try{initTerminal();}catch(e){console.warn('Terminal init:',e);}});


/* ═══════ Cipher Toolkit ═══════ */
function initCipherToolkit(){
 if(document.getElementById('cipherModal')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.' :'.-.-.-',',' :'--..--','?' :'..--..','':' / '};
 var RMORSE={};for(var k in MORSE)RMORSE[MORSE[k]]=k;
 function caesar(t,n,dec){n=parseInt(n)||3;if(dec)n=26-n;return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode((c.charCodeAt(0)-base+n)%26+base);});}
 function xorCipher(t,key){if(!key)key='K';var o='';for(var i=0;i<t.length;i++){o+=String.fromCharCode(t.charCodeAt(i)^key.charCodeAt(i%key.length));}return o;}
 function toMorse(t){return t.toUpperCase().split('').map(function(c){return MORSE[c]||c;}).join('');}
 function fromMorse(t){return t.split(' / ').map(function(w){return w.split('').map(function(c){return RMORSE[c]||c;}).join('');}).join('');}
 function rot13(t){return caesar(t,13,false);}
 function atbash(t){return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode(base+25-(c.charCodeAt(0)-base));});}
 function toBin(t){return t.split('').map(function(c){return ('00000000'+c.charCodeAt(0).toString(2)).slice(-8);}).join('');}
 function fromBin(t){return t.trim().split(/\s+/).map(function(b){return String.fromCharCode(parseInt(b,2));}).join('');}
 function encode(t,m,key){switch(m){case 'caesar':return caesar(t,key,false);case 'xor':return btoa(xorCipher(t,key));case 'morse':return toMorse(t);case 'base64':return btoa(unescape(encodeURIComponent(t)));case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return toBin(t);default:return t;}}
 function decode(t,m,key){switch(m){case 'caesar':return caesar(t,key,true);case 'xor':try{return xorCipher(atob(t),key);}catch(e){return 'Invalid input';}case 'morse':return fromMorse(t);case 'base64':try{return decodeURIComponent(escape(atob(t)));}catch(e){return 'Invalid Base64';}case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return fromBin(t);default:return t;}}
 var overlay=document.createElement('div');overlay.id='cipherOverlay';
 overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100000;display:none;align-items:center;justify-content:center;';
 var modal=document.createElement('div');modal.id='cipherModal';
 modal.style.cssText='background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:1.2rem;width:92%;max-width:420px;color:#e8e8e8;font-family:system-ui,sans-serif;max-height:90vh;overflow-y:auto;';
 modal.innerHTML='<div style="display:flex;align-items:center;margin-bottom:0.8rem;"><span style="flex:1;font-weight:bold;font-size:1.05rem;" data-i18n="cipherTitle">'+(L.cipherTitle||'\uD83D\uDD10 Cipher Toolkit')+'</span><button id="cipherCloseBtn" style="background:none;border:none;color:#e8e8e8;font-size:20px;cursor:pointer;">\u2715</button></div>'
 +'<textarea id="cipherIn" rows="3" placeholder="'+(L.cipherInput||'Input text')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;margin-bottom:0.6rem;" data-i18n-placeholder="cipherInput"></textarea>'
 +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;flex-wrap:wrap;">'
 +'<select id="cipherMethod" style="flex:1;min-width:120px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;"><option value="caesar">Caesar</option><option value="xor">XOR</option><option value="morse">Morse</option><option value="base64">Base64</option><option value="rot13">ROT13</option><option value="atbash">Atbash</option><option value="binary">Binary</option></select>'
 +'<input id="cipherKey" type="text" placeholder="'+(L.cipherKey||'Key')+'" value="3" style="width:70px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;" data-i18n-placeholder="cipherKey">'
 +'</div>'
 +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">'
 +'<button id="cipherEncBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,180,80,0.2);color:#0f0;cursor:pointer;font-size:0.85rem;" data-i18n="cipherEncode">'+(L.cipherEncode||'Encode')+'</button>'
 +'<button id="cipherDecBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,120,255,0.2);color:#4af;cursor:pointer;font-size:0.85rem;" data-i18n="cipherDecode">'+(L.cipherDecode||'Decode')+'</button>'
 +'</div>'
 +'<div style="position:relative;"><textarea id="cipherOut" rows="3" readonly placeholder="'+(L.cipherOutput||'Output')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#0f0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;" data-i18n-placeholder="cipherOutput"></textarea>'
 +'<button id="cipherCopyBtn" style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#e8e8e8;cursor:pointer;padding:2px 8px;font-size:0.75rem;" data-i18n="cipherCopy">'+(L.cipherCopy||'Copy')+'</button></div>';
 overlay.appendChild(modal);document.body.appendChild(overlay);
 var cipherBtn=document.createElement('button');cipherBtn.id='cipherToggleBtn';cipherBtn.textContent='\uD83D\uDD10';cipherBtn.title='Cipher';
 cipherBtn.style.cssText='position:fixed;bottom:10px;right:56px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#1a1a2e;color:#e8e8e8;border:1px solid rgba(255,255,255,0.15);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
 cipherBtn.onmouseenter=function(){this.style.opacity='1';};cipherBtn.onmouseleave=function(){this.style.opacity='0.7';};
 document.body.appendChild(cipherBtn);
 function showCipher(){overlay.style.display='flex';}
 function hideCipher(){overlay.style.display='none';}
 window.toggleCipherToolkit=function(){overlay.style.display==='flex'?hideCipher():showCipher();};
 cipherBtn.addEventListener('click',window.toggleCipherToolkit);
 document.getElementById('cipherCloseBtn').addEventListener('click',hideCipher);
 overlay.addEventListener('click',function(e){if(e.target===overlay)hideCipher();});
 document.getElementById('cipherEncBtn').addEventListener('click',function(){
 var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
 document.getElementById('cipherOut').value=encode(t,m,k);
 });
 document.getElementById('cipherDecBtn').addEventListener('click',function(){
 var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
 document.getElementById('cipherOut').value=decode(t,m,k);
 });
 document.getElementById('cipherCopyBtn').addEventListener('click',function(){
 var o=document.getElementById('cipherOut');
 if(navigator.clipboard){navigator.clipboard.writeText(o.value).then(function(){document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);});}
 else{o.select();document.execCommand('copy');document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);}
 });
}
document.addEventListener('DOMContentLoaded',function(){try{initCipherToolkit();}catch(e){console.warn('Cipher init:',e);}});



/* ═══════ Particle Celebrations ═══════ */
function initParticles(){
 if(document.getElementById('particleCanvas')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var canvas=document.createElement('canvas');
 canvas.id='particleCanvas';
 canvas.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
 document.body.appendChild(canvas);
 var ctx=canvas.getContext('2d');
 var particles=[];
 var animId=null;
 var colors=['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#00d2d3'];
 function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
 resize();window.addEventListener('resize',resize);
 function drawStar(cx,cy,r){ctx.beginPath();for(var i=0;i<5;i++){var a=Math.PI/2+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r);a+=Math.PI/5;ctx.lineTo(cx+Math.cos(a)*r*0.4,cy-Math.sin(a)*r*0.4);}ctx.closePath();ctx.fill();}
 function spawnParticles(x,y,count){
 var n=count||Math.floor(50+Math.random()*30);
 for(var i=0;i<n;i++){
 var angle=Math.random()*Math.PI*2;
 var speed=2+Math.random()*6;
 var shape=Math.floor(Math.random()*3);
 particles.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
 color:colors[Math.floor(Math.random()*colors.length)],
 size:3+Math.random()*5,life:1,decay:0.008+Math.random()*0.012,
 shape:shape,rotation:Math.random()*Math.PI*2,rotSpeed:(Math.random()-0.5)*0.2});
 }
 if(!animId) animate();
 }
 function animate(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 for(var i=particles.length-1;i>=0;i--){
 var p=particles[i];
 p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.vx*=0.99;p.vy*=0.99;
 p.life-=p.decay;p.rotation+=p.rotSpeed;
 if(p.life<=0){particles.splice(i,1);continue;}
 ctx.save();ctx.globalAlpha=p.life;ctx.fillStyle=p.color;
 ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
 if(p.shape===0){ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}
 else if(p.shape===1){ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);}
 else{drawStar(0,0,p.size);}
 ctx.restore();
 }
 if(particles.length>0){animId=requestAnimationFrame(animate);}
 else{ctx.clearRect(0,0,canvas.width,canvas.height);animId=null;}
 }
 window.triggerCelebration=function(x,y){spawnParticles(x||window.innerWidth/2,y||window.innerHeight/2);};
 window.triggerFireworks=function(){
 for(var i=0;i<3;i++){
 (function(idx){setTimeout(function(){
 spawnParticles(100+Math.random()*(window.innerWidth-200),100+Math.random()*(window.innerHeight-300),70);
 },idx*400);})(i);
 }
 };
 /* Hook into achievement system */
 var origDispatch=window.dispatchEvent;
 window.addEventListener('achievement-unlocked',function(e){
 var rect=document.body.getBoundingClientRect();
 window.triggerCelebration(rect.width/2,rect.height/3);
 });
 /* Hook into quiz/challenge completion */
 document.addEventListener('click',function(e){
 var btn=e.target;
 if(!btn)return;
 var txt=(btn.textContent||'').toLowerCase();
 var idn=(btn.id||'').toLowerCase();
 /* Challenge reveal */
 if(idn.indexOf('reveal')>=0||idn.indexOf('answer')>=0||txt.indexOf('reveal')>=0){
 var r=btn.getBoundingClientRect();
 spawnParticles(r.left+r.width/2,r.top+r.height/2,30);
 }
 /* Quiz submit - check score after small delay */
 if(idn.indexOf('quiz')>=0&&(idn.indexOf('submit')>=0||txt.indexOf('submit')>=0)){
 setTimeout(function(){
 var scoreEl=document.querySelector('[id*="quizScore"]')||document.querySelector('[id*="score"]');
 if(scoreEl){
 var m=scoreEl.textContent.match(/(\d+)\s*[%\/]/);
 if(m){var pct=parseInt(m[1]);if(pct>60){window.triggerFireworks();}}
 }
 },500);
 }
 /* Daily challenge complete */
 if(idn.indexOf('daily')>=0&&(idn.indexOf('complete')>=0||idn.indexOf('done')>=0||txt.indexOf('complete')>=0)){
 window.triggerFireworks();
 }
 });
}

/* ═══════ Comparison Mode ═══════ */
function initComparisonMode(){
 if(document.getElementById('comparePanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appKey='compare_'+window.location.pathname.replace(/[^a-z0-9]/gi,'_');
 var saved=JSON.parse(localStorage.getItem(appKey)||'{"a":null,"b":null}');
 function getSliders(){
 var sliders=document.querySelectorAll('input[type="range"]');
 var data=[];
 sliders.forEach(function(s){
 var label='';
 var prev=s.previousElementSibling;
 if(prev&&(prev.tagName==='LABEL'||prev.tagName==='SPAN')){label=prev.textContent.trim();}
 if(!label){var lbl=s.closest('label');if(lbl){label=lbl.textContent.replace(/[\d.]+/g,'').trim();}}
 if(!label){var par=s.parentElement;if(par){var sp=par.querySelector('label,span,.label');if(sp)label=sp.textContent.trim();}}
 if(!label) label=s.id||s.name||('slider-'+data.length);
 data.push({id:s.id||('s'+data.length),label:label,value:parseFloat(s.value),min:parseFloat(s.min||0),max:parseFloat(s.max||100)});
 });
 return data;
 }
 function setSliders(data){
 if(!data)return;
 var sliders=document.querySelectorAll('input[type="range"]');
 data.forEach(function(d,i){
 if(sliders[i]){sliders[i].value=d.value;sliders[i].dispatchEvent(new Event('input',{bubbles:true}));}
 });
 }
 function buildTable(){
 if(!saved.a&&!saved.b) return '<div style="opacity:0.5;font-size:0.8rem;padding:0.5rem;">Save experiments to A and B slots to compare.</div>';
 var html='<table style="width:100%;border-collapse:collapse;font-size:0.78rem;margin-top:0.5rem;">';
 html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.15);"><th style="text-align:left;padding:4px;">Parameter</th>';
 html+='<th style="padding:4px;">'+(L.compareSlotA||'Exp A')+'</th>';
 html+='<th style="padding:4px;">'+(L.compareSlotB||'Exp B')+'</th>';
 html+='<th style="padding:4px;">\u0394 Change</th></tr>';
 var rows=saved.a||saved.b;
 if(rows){rows.forEach(function(r,i){
 var a=saved.a?saved.a[i]:null;
 var b=saved.b?saved.b[i]:null;
 var va=a?a.value:'-';var vb=b?b.value:'-';
 var delta='';var clr='rgba(255,255,255,0.5)';
 if(a&&b){
 var diff=b.value-a.value;
 if(a.value!==0){var pct=Math.round((diff/a.value)*100);delta=(diff>0?'+':'')+pct+'%';
 if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';else{clr='rgba(255,255,255,0.4)';delta='0%';}
 }else{delta=diff>0?'+'+diff.toFixed(1):diff.toFixed(1);if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';}
 }
 html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">';
 html+='<td style="padding:3px 4px;opacity:0.85;">'+(a?a.label:(b?b.label:''))+'</td>';
 html+='<td style="padding:3px 4px;text-align:center;">'+(typeof va==='number'?va.toFixed(1):va)+'</td>';
 html+='<td style="padding:3px 4px;text-align:center;">'+(typeof vb==='number'?vb.toFixed(1):vb)+'</td>';
 html+='<td style="padding:3px 4px;text-align:center;color:'+clr+';font-weight:600;">'+delta+'</td></tr>';
 });}
 html+='</table>';return html;
 }
 function persist(){localStorage.setItem(appKey,JSON.stringify(saved));}
 /* Build UI */
 var panel=document.createElement('div');
 panel.id='comparePanel';
 panel.style.cssText='display:none;padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 panel.innerHTML='<div style="font-weight:600;margin-bottom:0.5rem;" data-i18n="compareTitle">'+(L.compareTitle||'\xf0\x9f\x93\x8a Compare')+'</div>'
 +'<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;">'
 +'<button id="compareSaveA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(54,160,255,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' A</button>'
 +'<button id="compareSaveB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,107,107,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' B</button>'
 +'<button id="compareLoadA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' A</button>'
 +'<button id="compareLoadB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' B</button>'
 +'<button id="compareClear" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareClear">'+(L.compareClear||'Clear')+'</button>'
 +'</div>'
 +'<div id="compareTable"></div>';
 var toggleBtn=document.createElement('button');
 toggleBtn.id='compareToggleBtn';
 toggleBtn.style.cssText='padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;margin:0.3rem 0;';
 toggleBtn.setAttribute('data-i18n','compareTitle');
 toggleBtn.textContent=L.compareTitle||'\xf0\x9f\x93\x8a Compare';
 var target=document.getElementById('mainCard');
 if(target&&target.parentNode){target.parentNode.insertBefore(toggleBtn,target.nextSibling);toggleBtn.parentNode.insertBefore(panel,toggleBtn.nextSibling);}
 else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc){fc.appendChild(toggleBtn);fc.appendChild(panel);}}
 toggleBtn.addEventListener('click',function(){
 var v=panel.style.display;panel.style.display=v==='none'?'block':'none';
 if(v==='none'){document.getElementById('compareTable').innerHTML=buildTable();}
 });
 document.getElementById('compareSaveA').addEventListener('click',function(){saved.a=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
 document.getElementById('compareSaveB').addEventListener('click',function(){saved.b=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
 document.getElementById('compareLoadA').addEventListener('click',function(){setSliders(saved.a);});
 document.getElementById('compareLoadB').addEventListener('click',function(){setSliders(saved.b);});
 document.getElementById('compareClear').addEventListener('click',function(){saved={a:null,b:null};persist();document.getElementById('compareTable').innerHTML=buildTable();});
}
document.addEventListener('DOMContentLoaded',function(){try{initParticles();}catch(e){console.warn('Particles init:',e);}try{initComparisonMode();}catch(e){console.warn('Compare init:',e);}});








/* ═══════ LAB NOTEBOOK ═══════ */
function initLabNotebook(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.labTitle)return;var _labLog=[];var _labStart=Date.now();var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey=appDir+'_labLog';var btnGen=document.getElementById('labGenBtn');var btnExp=document.getElementById('labExpBtn');if(!btnGen)return;document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var prevVal=inp.value;inp.addEventListener('input',function(){_labLog.push({t:Date.now()-_labStart,param:inp.id||inp.name||'slider',oldVal:prevVal,newVal:inp.value});prevVal=inp.value;});});function genReport(){var title=document.title||appDir;var dur=Math.round((Date.now()-_labStart)/1000);var mins=Math.floor(dur/60);var secs=dur%60;var paramCounts={};var paramMins={};var paramMaxs={};_labLog.forEach(function(e){if(!paramCounts[e.param])paramCounts[e.param]=0;paramCounts[e.param]++;var v=parseFloat(e.newVal);if(!isNaN(v)){if(paramMins[e.param]===undefined||v<paramMins[e.param])paramMins[e.param]=v;if(paramMaxs[e.param]===undefined||v>paramMaxs[e.param])paramMaxs[e.param]=v;}});var params=Object.keys(paramCounts);var totalAdj=_labLog.length;var mostMod=params.length?params.reduce(function(a,b){return paramCounts[a]>paramCounts[b]?a:b;}):'-';var allSliders=document.querySelectorAll('input[type="range"],input[type="number"]');var coverage=allSliders.length?Math.round(params.length/allSliders.length*100):0;var obs='';params.forEach(function(p){obs+=' - '+p+': changed '+paramCounts[p]+' times';if(paramMins[p]!==undefined)obs+=', range '+paramMins[p]+'\u2192'+paramMaxs[p];obs+='\n';});var report='\u2550\u2550\u2550 LAB NOTEBOOK \u2550\u2550\u2550\n'+'App: '+title+'\n'+'Date: '+new Date().toISOString().slice(0,10)+'\n'+'Duration: '+mins+'m '+secs+'s\n\n'+L.labHypothesis+'\n"Changing '+mostMod+' affects '+title+' behavior"\n\n'+L.labMethod+'\nParameters tested: '+params.join(', ')+'\nTotal adjustments: '+totalAdj+'\n\n'+L.labObservation+'\n'+obs+'\n'+L.labConclusion+'\nMost sensitive parameter: '+mostMod+'\nExploration coverage: '+coverage+'%\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n';return report;}btnGen.onclick=function(){var report=genReport();var box=document.getElementById('labReportBox');if(box){box.textContent=report;box.style.display='block';}try{localStorage.setItem(storageKey,JSON.stringify({date:new Date().toISOString(),log:_labLog}));}catch(e){}if(typeof playSound==='function')playSound('success');};btnExp.onclick=function(){var report=genReport();var blob=new Blob([report],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=appDir+'-lab-report.txt';a.click();URL.revokeObjectURL(a.href);};}

/* ═══════ DATA RECORDER ═══════ */
function initDataRecorder(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.recorderTitle)return;var recBtn=document.getElementById('recStartBtn');var clearBtn=document.getElementById('recClearBtn');var expBtn=document.getElementById('recExpBtn');var recCanvas=document.getElementById('recCanvas');var recStatus=document.getElementById('recStatus');if(!recBtn||!recCanvas)return;var ctx=recCanvas.getContext('2d');var recording=false;var recData=[];var recTimer=null;var maxPts=500;function sampleValues(){var vals={};document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var k=inp.id||inp.name||'v'+Math.random().toString(36).slice(2,5);vals[k]=parseFloat(inp.value)||0;});document.querySelectorAll('[id]').forEach(function(el){if(el.tagName==='INPUT')return;var txt=el.textContent;var m=txt.match(/[\d]+\.?[\d]*/);if(m&&txt.length<20&&el.id)vals['_'+el.id]=parseFloat(m[0]);});return vals;}function drawGraph(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);if(recData.length<2)return;var keys=Object.keys(recData[0].values);var firstKey=keys[0];if(!firstKey)return;var vals=recData.map(function(d){return d.values[firstKey]||0;});var mn=Math.min.apply(null,vals);var mx=Math.max.apply(null,vals);if(mn===mx){mn-=1;mx+=1;}var w=recCanvas.width;var h=recCanvas.height;var pad=4;ctx.strokeStyle='#33ff88';ctx.lineWidth=1.5;ctx.beginPath();for(var i=0;i<vals.length;i++){var x=pad+(w-2*pad)*(i/(vals.length-1));var y=h-pad-(h-2*pad)*((vals[i]-mn)/(mx-mn));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#33ff8840';ctx.lineTo(w-pad,h-pad);ctx.lineTo(pad,h-pad);ctx.fill();}var rafId=null;function animLoop(){drawGraph();if(recording)rafId=requestAnimationFrame(animLoop);}recBtn.onclick=function(){if(!recording){recording=true;recBtn.textContent=L.recorderStop;recBtn.style.background='rgba(255,60,60,0.2)';recTimer=setInterval(function(){if(recData.length>=maxPts){clearInterval(recTimer);recording=false;recBtn.textContent=L.recorderStart;recBtn.style.background='';return;}recData.push({time:Date.now(),values:sampleValues()});recStatus.textContent=(L.recorderTitle||'Recording')+': '+recData.length+''+(L.recorderPoints||'pts');},500);rafId=requestAnimationFrame(animLoop);}else{recording=false;clearInterval(recTimer);if(rafId)cancelAnimationFrame(rafId);recBtn.textContent=L.recorderStart;recBtn.style.background='';drawGraph();}};clearBtn.onclick=function(){recData=[];recStatus.textContent='';ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);};expBtn.onclick=function(){if(!recData.length)return;var keys=Object.keys(recData[0].values);var header='time,'+keys.join(',')+'\n';var rows=recData.map(function(d){return d.time+','+keys.map(function(k){return d.values[k]||0;}).join(',');}).join('\n');var csv=header+rows;var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';a.download=appDir+'-recording.csv';a.click();URL.revokeObjectURL(a.href);};drawGraph();}

document.addEventListener('DOMContentLoaded',function(){initLabNotebook();initDataRecorder();});



/* ═══════ MISSION BRIEFING ═══════ */

/* Layout fix: secondary panels hidden by default */
(function(){
 var s=document.createElement('style');
 s.textContent=`
 .secondary-panel{display:none;margin:8px 0;padding:10px;border-radius:8px;background:var(--card-bg,#1a1a2e);border:1px solid rgba(255,255,255,0.1)}
 .secondary-panel.visible{display:block}
 .panel-toggle{cursor:pointer;padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:inherit;font-size:12px;margin:2px}
 .panel-toggle.active{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.4)}
 .tools-bar{display:flex;flex-wrap:wrap;gap:4px;padding:6px;margin:4px 0;border-radius:6px;background:rgba(0,0,0,0.2)}
 `;
 document.head.appendChild(s);
})();

function initMissionBriefing(){var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var ssKey='mission_seen_'+appDir;if(sessionStorage.getItem(ssKey))return;sessionStorage.setItem(ssKey,'1');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var overlay=document.createElement('div');overlay.id='missionOverlay';overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:monospace;color:#00ff41;overflow:hidden;';var stamp=document.createElement('div');stamp.textContent=L.missionClassified||'CLASSIFIED';stamp.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(3) rotate(-15deg);font-size:4rem;font-weight:bold;color:#ff0000;opacity:0;animation:stampIn 0.6s ease-out 0.3s forwards;pointer-events:none;text-transform:uppercase;letter-spacing:0.3em;';overlay.appendChild(stamp);var box=document.createElement('div');box.style.cssText='max-width:600px;padding:2rem;text-align:center;opacity:0;transition:opacity 0.5s;';var titleEl=document.createElement('h2');titleEl.textContent=L.missionTitle||'MISSION BRIEFING';titleEl.style.cssText='color:#00ff41;font-size:1.5rem;margin-bottom:1rem;letter-spacing:0.2em;text-transform:uppercase;';box.appendChild(titleEl);var objLabel=document.createElement('div');objLabel.textContent=L.missionObjective||'Your mission objective:';objLabel.style.cssText='color:#00aa30;font-size:0.9rem;margin-bottom:0.5rem;';box.appendChild(objLabel);var typewriter=document.createElement('div');typewriter.style.cssText='color:#00ff41;font-size:1.1rem;min-height:3rem;line-height:1.6;text-align:left;border-left:2px solid #00ff41;padding-left:1rem;margin:1rem 0;';box.appendChild(typewriter);var agentEl=document.createElement('div');agentEl.textContent=L.missionAgent||'AGENT-000000';agentEl.style.cssText='color:#ffaa00;font-size:1.2rem;margin:1rem 0;letter-spacing:0.15em;';box.appendChild(agentEl);var goBtn=document.createElement('button');goBtn.textContent=L.missionGo||'ACCEPT MISSION';goBtn.style.cssText='background:#00ff41;color:#000;border:none;padding:0.8rem 2rem;font-size:1rem;font-family:monospace;font-weight:bold;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-top:1rem;';goBtn.onmouseover=function(){this.style.background='#00cc33';};goBtn.onmouseout=function(){this.style.background='#00ff41';};goBtn.onclick=function(){dismiss();};box.appendChild(goBtn);overlay.appendChild(box);var skipEl=document.createElement('div');skipEl.textContent=L.missionSkip||'Skip';skipEl.style.cssText='position:absolute;top:1rem;right:1.5rem;color:#555;font-size:0.8rem;cursor:pointer;';skipEl.onclick=function(){dismiss();};overlay.appendChild(skipEl);var styleEl=document.createElement('style');styleEl.textContent='@keyframes stampIn{from{transform:translate(-50%,-50%) scale(3) rotate(-15deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(-12deg);opacity:0.8}}';document.head.appendChild(styleEl);document.body.appendChild(overlay);var missionText=L.mission_obj||'Complete all objectives.';var charIdx=0;setTimeout(function(){stamp.style.opacity='0';stamp.style.transition='opacity 0.5s';setTimeout(function(){stamp.style.display='none';},500);box.style.opacity='1';var iv=setInterval(function(){if(charIdx<missionText.length){typewriter.textContent+=missionText[charIdx];charIdx++;}else{clearInterval(iv);}},30);},1500);var autoTimer=setTimeout(function(){dismiss();},15000);function dismiss(){clearTimeout(autoTimer);if(overlay.parentNode){overlay.style.opacity='0';overlay.style.transition='opacity 0.4s';setTimeout(function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);},400);}}}
try{document.addEventListener('DOMContentLoaded',function(){initMissionBriefing();});}catch(e){}

/* ═══════ NIGHT VISION MODE ═══════ */
function initNightVision(){var nvStyle=document.createElement('style');nvStyle.textContent='.night-vision{filter:hue-rotate(80deg) saturate(1.5);background:#001100 !important;}.night-vision *{color:#00ff41 !important;border-color:#00ff4133 !important;}.night-vision::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(0,255,65,0.03) 0px,rgba(0,255,65,0.03) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:99998;}.night-vision .card,.night-vision .sidebar{background:#001a00 !important;}';document.head.appendChild(nvStyle);var hour=new Date().getHours();var stored=localStorage.getItem('nightVisionPref');var active=stored!==null?(stored==='on'):(hour>=20||hour<6);if(active)document.body.classList.add('night-vision');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var btn=document.createElement('button');btn.className='btn-sm';btn.textContent='\uD83C\uDF19 NV';btn.title=L.nightVisionTitle||'Night Vision Mode';btn.style.cssText='margin-left:0.3rem;font-size:0.75rem;padding:0.2rem 0.5rem;cursor:pointer;';btn.onclick=function(){var isOn=document.body.classList.toggle('night-vision');localStorage.setItem('nightVisionPref',isOn?'on':'off');};var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');if(hdr){hdr.appendChild(btn);}else{btn.style.cssText+='position:fixed;top:0.5rem;right:0.5rem;z-index:9999;';document.body.appendChild(btn);}}
try{initNightVision();}catch(e){}

/* ═══════ DAILY CHALLENGE ═══════ */
function initDailyChallenge(){const L=LANG[document.documentElement.lang||'en'];const dc=document.getElementById('dailyChallenge');if(!dc||!L.dailyTitle)return;const dayIndex=new Date().getDay();const challengeKey='daily_d'+(dayIndex===0?7:dayIndex);const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const streakKey=appDir+'_streak';let streak=parseInt(localStorage.getItem(streakKey)||'0');const lastDate=localStorage.getItem(streakKey+'_date')||'';const today=new Date().toDateString();dc.innerHTML='<h3 data-i18n="dailyTitle">'+L.dailyTitle+'</h3>'+'<p style="font-size:0.95rem;margin:0.5rem 0;" data-i18n="'+challengeKey+'">'+(L[challengeKey]||'Complete today\x27s challenge!')+'</p>'+'<button class="btn-sm" id="dailyHintBtn" style="margin:0.3rem 0;" data-i18n="dailyHint">'+L.dailyHint+'</button>'+'<p id="dailyHintText" style="display:none;font-size:0.8rem;opacity:0.7;margin:0.3rem 0;">Think step by step. Break the problem into smaller parts.</p>'+'<div style="margin:0.5rem 0;font-size:1.1rem;">\ud83d\udd25 <span data-i18n="dailyStreak">'+L.dailyStreak+'</span>: <strong id="streakCount">'+streak+'</strong></div>'+'<button class="btn-sm" id="dailyCompleteBtn" data-i18n="dailyComplete">'+L.dailyComplete+'</button>';document.getElementById('dailyHintBtn').onclick=function(){const h=document.getElementById('dailyHintText');h.style.display=h.style.display==='none'?'block':'none';};document.getElementById('dailyCompleteBtn').onclick=function(){if(lastDate===today)return;streak++;localStorage.setItem(streakKey,streak);localStorage.setItem(streakKey+'_date',today);document.getElementById('streakCount').textContent=streak;this.textContent='\u2705';this.disabled=true;if(typeof playSound==='function')playSound('success');};}

/* ═══════ MENTOR MODE ═══════ */
function initMentorMode(){const L=LANG[document.documentElement.lang||'en'];const ov=document.getElementById('mentorOverlay');if(!ov||!L.mentorTitle)return;let step=0;const total=5;const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const doneKey=appDir+'_mentor_done';function renderStep(){const s=L['mentor_s'+(step+1)]||'Step '+(step+1);ov.innerHTML='<div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9998;" id="mentorBg"></div>'+'<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--card-bg,#1a1a2e);border:2px solid var(--accent,#d4af37);border-radius:12px;padding:1.5rem;max-width:400px;width:90%;text-align:center;color:var(--text,#fff);">'+'<h3 data-i18n="mentorTitle">'+L.mentorTitle+'</h3>'+'<p style="font-size:0.8rem;opacity:0.6;margin:0.3rem 0;">'+(L.mentorStep||'Step')+''+(step+1)+'/'+total+'</p>'+'<p style="font-size:0.95rem;line-height:1.5;margin:1rem 0;" data-i18n="mentor_s'+(step+1)+'">'+s+'</p>'+'<div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;">'+(step>0?'<button class="btn-sm" id="mentorPrevBtn" data-i18n="mentorPrev">'+(L.mentorPrev||'Previous')+'</button>':'')+(step<total-1?'<button class="btn-sm" id="mentorNextBtn" data-i18n="mentorNext">'+(L.mentorNext||'Next')+'</button>':'<button class="btn-sm" id="mentorDoneBtn" data-i18n="mentorDone">'+(L.mentorDone||'Finish')+'</button>')+'</div></div>';var bg=document.getElementById('mentorBg');if(bg)bg.onclick=closeMentor;if(document.getElementById('mentorPrevBtn'))document.getElementById('mentorPrevBtn').onclick=function(){step--;renderStep();};if(document.getElementById('mentorNextBtn'))document.getElementById('mentorNextBtn').onclick=function(){step++;renderStep();};if(document.getElementById('mentorDoneBtn'))document.getElementById('mentorDoneBtn').onclick=closeMentor;}function closeMentor(){ov.innerHTML='';ov.style.display='none';localStorage.setItem(doneKey,'1');}var tb=document.getElementById('mentorTriggerBtn');if(tb)tb.onclick=function(){step=0;ov.style.display='block';renderStep();};}

document.addEventListener('DOMContentLoaded',function(){initDailyChallenge();initMentorMode();});


/* ═══════ Voice Command Engine ═══════ */
function initVoiceControl(){
 if(document.getElementById('voiceBtn'))return;
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR)return;
 var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var btn=document.createElement('button');
 btn.className='voice-btn';btn.id='voiceBtn';
 btn.setAttribute('data-i18n','voiceTitle');
 btn.textContent=lang.voiceTitle||'\ud83c\udfa4 Voice';
 btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
 var ind=document.createElement('div');
 ind.className='voice-indicator';ind.id='voiceIndicator';
 ind.style.cssText='display:none;position:fixed;top:10px;right:10px;width:12px;height:12px;background:red;border-radius:50%;z-index:9999;';
 document.body.appendChild(ind);
 var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
 if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
 var recognition=new SR();
 recognition.continuous=true;recognition.interimResults=false;
 recognition.lang=document.documentElement.lang==='fr'?'fr-FR':document.documentElement.lang==='ar'?'ar-SA':'en-US';
 var active=false,silenceTimer=null;
 function stopListening(){
 active=false;recognition.stop();ind.style.display='none';
 btn.textContent=lang.voiceOff||'\ud83c\udfa4 Voice OFF';
 if(silenceTimer)clearTimeout(silenceTimer);
 }
 function startListening(){
 active=true;recognition.start();ind.style.display='block';
 ind.style.animation='voicePulse 1s infinite';
 btn.textContent=lang.voiceListening||'\ud83c\udfa4 Listening...';
 resetSilenceTimer();
 }
 function resetSilenceTimer(){
 if(silenceTimer)clearTimeout(silenceTimer);
 silenceTimer=setTimeout(function(){stopListening();},30000);
 }
 if(!document.getElementById('voicePulseStyle')){
 var st=document.createElement('style');st.id='voicePulseStyle';
 st.textContent='@keyframes voicePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}';
 document.head.appendChild(st);
 }
 var cmdMap={
 'start':function(){var b=document.getElementById('startBtn')||document.querySelector('[data-action=start]');if(b)b.click();},
 'stop':function(){var b=document.getElementById('stopBtn')||document.querySelector('[data-action=stop]');if(b)b.click();},
 'reset':function(){var b=document.getElementById('resetBtn')||document.querySelector('[data-action=reset]');if(b)b.click();},
 'help':function(){var b=document.getElementById('helpBtn');if(b)b.click();},
 'theme':function(){var b=document.getElementById('settingsBtn');if(b)b.click();},
 'next':function(){var a=document.getElementById('pathNextLink');if(a&&a.href)location.href=a.href;},
 'previous':function(){var a=document.getElementById('pathPrevLink');if(a&&a.href)location.href=a.href;},
 'd\xe9marrer':function(){cmdMap['start']();},
 'arr\xeater':function(){cmdMap['stop']();},
 'aide':function(){cmdMap['help']();},
 '\u0627\u0628\u062f\u0623':function(){cmdMap['start']();},
 '\u062a\u0648\u0642\u0641':function(){cmdMap['stop']();}
 };
 recognition.onresult=function(e){
 resetSilenceTimer();
 for(var i=e.resultIndex;i<e.results.length;i++){
 if(e.results[i].isFinal){
 var t=e.results[i][0].transcript.trim().toLowerCase();
 for(var c in cmdMap){if(t.indexOf(c)!==-1){cmdMap[c]();break;}}
 }
 }
 };
 recognition.onerror=function(){if(active)try{recognition.start();}catch(x){}};
 recognition.onend=function(){if(active)try{recognition.start();}catch(x){}};
 btn.addEventListener('click',function(){if(active)stopListening();else startListening();});
}
try{initVoiceControl();}catch(e){}

/* ═══════ Share Results Engine ═══════ */
function initShareSystem(){
 if(document.getElementById('shareBtn'))return;
 var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var btn=document.createElement('button');
 btn.className='share-btn';btn.id='shareBtn';
 btn.setAttribute('data-i18n','shareBtn');
 btn.textContent=lang.shareBtn||'\ud83d\udce4 Share';
 btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
 var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
 if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
 var expBtn=document.createElement('button');
 expBtn.className='share-btn';expBtn.id='shareExportBtn';
 expBtn.setAttribute('data-i18n','shareExport');
 expBtn.textContent=lang.shareExport||'\ud83d\udce4 Export JSON';
 expBtn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
 if(tgt)tgt.appendChild(expBtn);else document.body.appendChild(expBtn);
 function gatherState(){
 var title=document.querySelector('h1')&&document.querySelector('h1').textContent||'Experiment';
 var params=[];
 document.querySelectorAll('input[type=range]').forEach(function(s){
 var lbl=s.previousElementSibling&&s.previousElementSibling.textContent||s.id||'param';
 params.push(lbl.trim()+': '+s.value);
 });
 var dot=document.getElementById('statusDot');
 var status=dot&&dot.classList.contains('active')?'Running':'Stopped';
 return{title:title,params:params,status:status};
 }
 function buildCard(st){
 var lines=['\ud83d\udd2c '+st.title+' \u2014 Experiment Results',
 '\u2501'.repeat(20),
 'Parameters: '+(st.params.length?st.params.join(' | '):'default'),
 'Status: '+st.status,
 '\u2501'.repeat(20),
 'Generated by Workshop-DIY'];
 return lines.join('\n');
 }
 function copyText(txt){
 if(navigator.clipboard&&navigator.clipboard.writeText){
 navigator.clipboard.writeText(txt).then(function(){showToast(lang.shareCopied||'Copied!');}).catch(function(){fallbackCopy(txt);});
 }else{fallbackCopy(txt);}
 }
 function fallbackCopy(txt){
 var ta=document.createElement('textarea');ta.value=txt;
 ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);
 ta.select();try{document.execCommand('copy');showToast(lang.shareCopied||'Copied!');}catch(e){}
 document.body.removeChild(ta);
 }
 function showToast(msg){
 var t=document.getElementById('toastMessage');
 if(t){t.textContent=msg;var p=t.parentElement&&t.parentElement.parentElement;if(p)p.classList.add('show');setTimeout(function(){if(p)p.classList.remove('show');},2000);}
 }
 btn.addEventListener('click',function(){
 var st=gatherState();var card=buildCard(st);copyText(card);
 });
 expBtn.addEventListener('click',function(){
 var st=gatherState();
 var logs=[];
 var logEl=document.getElementById('logContainer');
 if(logEl)logEl.querySelectorAll('.log-entry,.log-line').forEach(function(e){logs.push(e.textContent);});
 var data={title:st.title,params:st.params,status:st.status,logs:logs,exported:new Date().toISOString()};
 var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);
 a.download=(st.title.replace(/[^a-z0-9]/gi,'_')||'export')+'_data.json';
 a.click();URL.revokeObjectURL(a.href);
 });
}
try{initShareSystem();}catch(e){}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
 if(document.getElementById('sonifyPanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var panel=document.createElement('div');
 panel.id='sonifyPanel';
 panel.className='sonify-panel';
 panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
 +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
 +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
 +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
 +'</div>'
 +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
 +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
 +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
 +'</div>'
 +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
 +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
 var target=document.getElementById('mainCard');
 if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
 else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
 var actx=null,osc=null,gain=null,analyser=null,running=false;
 var toggle=document.getElementById('sonifyToggle');
 var status=document.getElementById('sonifyStatus');
 var freqDisp=document.getElementById('sonifyFreqDisp');
 var volSlider=document.getElementById('sonifyVolSlider');
 var wCanvas=document.getElementById('sonifyWaveCanvas');
 var wCtx=wCanvas.getContext('2d');
 function startAudio(){
 if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
 if(actx.state==='suspended'){actx.resume();}
 analyser=actx.createAnalyser();analyser.fftSize=256;
 osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
 gain=actx.createGain();gain.gain.value=volSlider.value/300;
 osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
 osc.start();running=true;drawWave();
 }
 function stopAudio(){
 running=false;
 try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
 try{if(gain){gain.disconnect();}}catch(e){}
 try{if(analyser){analyser.disconnect();}}catch(e){}
 osc=null;gain=null;analyser=null;
 wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
 }
 function drawWave(){
 if(!running||!analyser)return;
 var buf=new Uint8Array(analyser.frequencyBinCount);
 analyser.getByteTimeDomainData(buf);
 wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
 wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
 wCtx.beginPath();
 var sl=wCanvas.width/buf.length;var x=0;
 for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
 wCtx.stroke();requestAnimationFrame(drawWave);
 }
 function mapData(){
 var c=document.getElementById('simCanvas');
 if(!c)return 440;
 try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
 }
 var sonifyInterval=null;
 toggle.addEventListener('click',function(){
 if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
 status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
 }else{startAudio();
 sonifyInterval=setInterval(function(){
 if(!running||!osc)return;
 var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
 freqDisp.textContent=Math.round(f)+' Hz';
 if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
 },100);
 status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
 }
 });
 volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

/* ═══════ Smart Tooltips ═══════ */
function initTooltips(){
 if(document.getElementById('tooltipFloat')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var tipMap={};
 var allBtns=document.querySelectorAll('button');
 allBtns.forEach(function(b){
 var txt=(b.textContent||'').toLowerCase().trim();
 if(txt.indexOf('start')>-1||txt.indexOf('lancer')>-1||txt.indexOf('\u0627\u0628\u062f\u0623')>-1) tipMap[b.id||Math.random()]=L.tip_start||'Start the simulation';
 else if(txt.indexOf('stop')>-1||txt.indexOf('arr')>-1||txt.indexOf('\u0623\u0648\u0642\u0641')>-1) tipMap[b.id||Math.random()]=L.tip_stop||'Stop the simulation';
 else if(txt.indexOf('reset')>-1||txt.indexOf('effac')>-1||txt.indexOf('\u0627\u0645\u0633\u062d')>-1) tipMap[b.id||Math.random()]=L.tip_reset||'Reset to defaults';
 else if(txt.indexOf('theme')>-1||txt.indexOf('th\u00e8me')>-1||txt.indexOf('\u0627\u0644\u0645\u0638\u0647\u0631')>-1) tipMap[b.id||Math.random()]=L.tip_theme||'Change theme';
 else if(txt.indexOf('help')>-1||txt.indexOf('aide')>-1||txt.indexOf('\u0645\u0633\u0627\u0639\u062f')>-1) tipMap[b.id||Math.random()]=L.tip_help||'Open help';
 });
 var floatDiv=document.createElement('div');
 floatDiv.className='tooltip-float';
 floatDiv.id='tooltipFloat';
 floatDiv.style.cssText='display:none;position:fixed;z-index:9999;background:#1a1a2e;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;max-width:250px;pointer-events:none;transition:opacity 0.2s;opacity:0;';
 document.body.appendChild(floatDiv);
 var tooltipsEnabled=true;
 function showTip(e,text){
 if(!tooltipsEnabled) return;
 floatDiv.textContent=text;
 floatDiv.style.display='block';
 setTimeout(function(){floatDiv.style.opacity='1';},10);
 moveTip(e);
 }
 function moveTip(e){
 var isRTL=document.documentElement.dir==='rtl';
 var x=e.clientX,y=e.clientY;
 if(isRTL){
 floatDiv.style.left='';
 floatDiv.style.right=(window.innerWidth-x+12)+'px';
 } else {
 floatDiv.style.right='';
 floatDiv.style.left=(x+12)+'px';
 }
 floatDiv.style.top=(y+12)+'px';
 }
 function hideTip(){
 floatDiv.style.opacity='0';
 setTimeout(function(){floatDiv.style.display='none';},200);
 }
 allBtns.forEach(function(b){
 var key=b.id||Math.random();
 if(tipMap[key]){
 b.addEventListener('mouseenter',function(e){showTip(e,tipMap[key]);});
 b.addEventListener('mousemove',moveTip);
 b.addEventListener('mouseleave',hideTip);
 }
 });
 var sliders=document.querySelectorAll('input[type="range"]');
 sliders.forEach(function(s){
 var tipText=L.tip_slider||'Drag to adjust this parameter';
 s.addEventListener('mouseenter',function(e){showTip(e,tipText);});
 s.addEventListener('mousemove',moveTip);
 s.addEventListener('mouseleave',hideTip);
 });
 var toggleBtn=document.createElement('button');
 toggleBtn.className='btn-sm';
 toggleBtn.style.cssText='margin:0.3rem;font-size:12px;';
 toggleBtn.textContent=L.tooltipToggle||'Toggle Tooltips';
 toggleBtn.setAttribute('data-i18n','tooltipToggle');
 toggleBtn.addEventListener('click',function(){
 tooltipsEnabled=!tooltipsEnabled;
 toggleBtn.style.opacity=tooltipsEnabled?'1':'0.5';
 });
 var target=document.querySelector('.sidebar-footer')||document.querySelector('.card')||document.body;
 if(target) target.appendChild(toggleBtn);
}

/* ═══════ Parameter Space Explorer ═══════ */
function initExplorer(){
 if(document.getElementById('explorerPanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var sliders=document.querySelectorAll('input[type="range"]');
 if(sliders.length===0) return;
 var panel=document.createElement('div');
 panel.id='explorerPanel';
 panel.className='explorer-panel';
 panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 var title=L.explorerTitle||'Parameter Space Explorer';
 var startLabel=L.explorerStart||'Auto-Explore';
 var stopLabel=L.explorerStop||'Stop Exploration';
 var infoText=L.explorerInfo||'Systematically tests min/mid/max for each slider and records results';
 panel.innerHTML='<h4 style="margin:0 0 0.5rem 0;font-size:14px;" data-i18n="explorerTitle">'+title+'</h4>'
 +'<p style="font-size:12px;opacity:0.7;margin:0 0 0.5rem 0;" data-i18n="explorerInfo">'+infoText+'</p>'
 +'<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:0.5rem;">'
 +'<button id="explorerStartBtn" class="btn-sm" data-i18n="explorerStart">'+startLabel+'</button>'
 +'<button id="explorerStopBtn" class="btn-sm" style="display:none;" data-i18n="explorerStop">'+stopLabel+'</button>'
 +'<button id="explorerApplyBtn" class="btn-sm" style="display:none;">Apply Best</button>'
 +'</div>'
 +'<div id="explorerProgress" style="display:none;margin-bottom:0.5rem;">'
 +'<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">'
 +'<div id="explorerBar" style="height:100%;background:var(--accent,#00ff88);width:0%;transition:width 0.3s;"></div>'
 +'</div>'
 +'<span id="explorerPct" style="font-size:11px;opacity:0.7;">0%</span>'
 +'</div>'
 +'<div id="explorerResults" style="font-size:11px;max-height:200px;overflow-y:auto;"></div>';
 var wikiSection=document.querySelector('.wiki-entry')||document.querySelector('.sidebar-body')||document.querySelector('.card');
 if(wikiSection&&wikiSection.parentNode){
 wikiSection.parentNode.insertBefore(panel,wikiSection);
 } else {
 document.body.appendChild(panel);
 }
 var exploring=false;
 var explorerTimer=null;
 var results=[];
 var bestCombo=null;
 var bestScore=-Infinity;
 var startBtn=document.getElementById('explorerStartBtn');
 var stopBtn=document.getElementById('explorerStopBtn');
 var applyBtn=document.getElementById('explorerApplyBtn');
 var progressDiv=document.getElementById('explorerProgress');
 var barDiv=document.getElementById('explorerBar');
 var pctSpan=document.getElementById('explorerPct');
 var resultsDiv=document.getElementById('explorerResults');
 function getCanvasScore(){
 var canvas=document.querySelector('canvas');
 if(!canvas) return Math.random()*100;
 try{
 var ctx=canvas.getContext('2d');
 var data=ctx.getImageData(0,0,Math.min(canvas.width,100),Math.min(canvas.height,100)).data;
 var sum=0,nonZero=0;
 for(var i=0;i<data.length;i+=16){sum+=data[i]+data[i+1]+data[i+2];if(data[i]||data[i+1]||data[i+2])nonZero++;}
 return nonZero>0?(sum/nonZero):0;
 }catch(e){return Math.random()*100;}
 }
 function generateCombinations(){
 var combos=[];
 var sliderArr=Array.from(sliders);
 var levels=sliderArr.map(function(s){
 var mn=parseFloat(s.min)||0,mx=parseFloat(s.max)||100;
 return [mn,(mn+mx)/2,mx];
 });
 if(sliderArr.length<=2){
 function cartesian(arrays,prefix){
 if(arrays.length===0){combos.push(prefix.slice());return;}
 var first=arrays[0],rest=arrays.slice(1);
 for(var i=0;i<first.length;i++){prefix.push(first[i]);cartesian(rest,prefix);prefix.pop();}
 }
 cartesian(levels,[]);
 } else {
 for(var si=0;si<sliderArr.length;si++){
 for(var li=0;li<3;li++){
 var combo=sliderArr.map(function(s){return parseFloat(s.value);});
 combo[si]=levels[si][li];
 combos.push(combo);
 }
 }
 }
 return combos;
 }
 function runExploration(){
 exploring=true;
 results=[];
 bestScore=-Infinity;
 bestCombo=null;
 startBtn.style.display='none';
 stopBtn.style.display='';
 applyBtn.style.display='none';
 progressDiv.style.display='block';
 resultsDiv.innerHTML='';
 var combos=generateCombinations();
 var idx=0;
 var sliderArr=Array.from(sliders);
 var origValues=sliderArr.map(function(s){return s.value;});
 function step(){
 if(!exploring||idx>=combos.length){
 finishExploration(sliderArr,origValues);
 return;
 }
 var combo=combos[idx];
 sliderArr.forEach(function(s,i){
 s.value=combo[i];
 s.dispatchEvent(new Event('input',{bubbles:true}));
 });
 var pct=Math.round((idx+1)/combos.length*100);
 barDiv.style.width=pct+'%';
 pctSpan.textContent=pct+'%';
 setTimeout(function(){
 var score=getCanvasScore();
 results.push({combo:combo.slice(),score:score});
 if(score>bestScore){bestScore=score;bestCombo=combo.slice();}
 idx++;
 explorerTimer=setTimeout(step,120);
 },80);
 }
 step();
 }
 function finishExploration(sliderArr,origValues){
 exploring=false;
 startBtn.style.display='';
 stopBtn.style.display='none';
 progressDiv.style.display='none';
 barDiv.style.width='0%';
 sliderArr.forEach(function(s,i){
 s.value=origValues[i];
 s.dispatchEvent(new Event('input',{bubbles:true}));
 });
 var html='<table style="width:100%;border-collapse:collapse;font-size:11px;"><tr style="border-bottom:1px solid rgba(255,255,255,0.15);">';
 sliderArr.forEach(function(s,i){html+='<th style="padding:2px 4px;text-align:left;">P'+(i+1)+'</th>';});
 html+='<th style="padding:2px 4px;text-align:left;">Score</th></tr>';
 var sorted=results.slice().sort(function(a,b){return b.score-a.score;});
 var top=sorted.slice(0,12);
 top.forEach(function(r,ri){
 var bg=ri===0?'rgba(0,255,136,0.15)':'transparent';
 html+='<tr style="background:'+bg+';border-bottom:1px solid rgba(255,255,255,0.05);">';
 r.combo.forEach(function(v){html+='<td style="padding:2px 4px;">'+parseFloat(v).toFixed(1)+'</td>';});
 html+='<td style="padding:2px 4px;font-weight:bold;">'+r.score.toFixed(1)+'</td></tr>';
 });
 html+='</table>';
 if(results.length>0){
 html+='<div style="margin-top:0.3rem;font-size:11px;opacity:0.7;">'+(L.explorerResult||'Exploration Complete')+' — '+results.length+' combos tested</div>';
 }
 resultsDiv.innerHTML=html;
 if(bestCombo){
 applyBtn.style.display='';
 try{localStorage.setItem('wdiy-explorer-best',JSON.stringify(bestCombo));}catch(e){}
 }
 }
 startBtn.addEventListener('click',function(){
 if(!exploring) runExploration();
 });
 stopBtn.addEventListener('click',function(){
 exploring=false;
 });
 applyBtn.addEventListener('click',function(){
 var combo=bestCombo;
 try{var stored=localStorage.getItem('wdiy-explorer-best');if(stored) combo=JSON.parse(stored);}catch(e){}
 if(!combo) return;
 var sliderArr=Array.from(sliders);
 sliderArr.forEach(function(s,i){
 if(combo[i]!==undefined){s.value=combo[i];s.dispatchEvent(new Event('input',{bubbles:true}));}
 });
 });
}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
 if(document.getElementById('sonifyPanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var panel=document.createElement('div');
 panel.id='sonifyPanel';
 panel.className='sonify-panel';
 panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
 +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
 +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
 +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
 +'</div>'
 +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
 +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
 +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
 +'</div>'
 +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
 +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
 var target=document.getElementById('mainCard');
 if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
 else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
 var actx=null,osc=null,gain=null,analyser=null,running=false;
 var toggle=document.getElementById('sonifyToggle');
 var status=document.getElementById('sonifyStatus');
 var freqDisp=document.getElementById('sonifyFreqDisp');
 var volSlider=document.getElementById('sonifyVolSlider');
 var wCanvas=document.getElementById('sonifyWaveCanvas');
 var wCtx=wCanvas.getContext('2d');
 function startAudio(){
 if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
 if(actx.state==='suspended'){actx.resume();}
 analyser=actx.createAnalyser();analyser.fftSize=256;
 osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
 gain=actx.createGain();gain.gain.value=volSlider.value/300;
 osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
 osc.start();running=true;drawWave();
 }
 function stopAudio(){
 running=false;
 try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
 try{if(gain){gain.disconnect();}}catch(e){}
 try{if(analyser){analyser.disconnect();}}catch(e){}
 osc=null;gain=null;analyser=null;
 wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
 }
 function drawWave(){
 if(!running||!analyser)return;
 var buf=new Uint8Array(analyser.frequencyBinCount);
 analyser.getByteTimeDomainData(buf);
 wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
 wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
 wCtx.beginPath();
 var sl=wCanvas.width/buf.length;var x=0;
 for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
 wCtx.stroke();requestAnimationFrame(drawWave);
 }
 function mapData(){
 var c=document.getElementById('simCanvas');
 if(!c)return 440;
 try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
 }
 var sonifyInterval=null;
 toggle.addEventListener('click',function(){
 if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
 status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
 }else{startAudio();
 sonifyInterval=setInterval(function(){
 if(!running||!osc)return;
 var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
 freqDisp.textContent=Math.round(f)+' Hz';
 if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
 },100);
 status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
 }
 });
 volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}

/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';

function setLanguage(lang) {
 currentLang = lang;
 const s = LANG[lang];
 if (!s) return;
 document.querySelectorAll('[data-i18n]').forEach(el => {
 const k = el.dataset.i18n;
 if (s[k] != null) el.textContent = s[k];
 });
 document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
 const k = opt.dataset.i18nOpt;
 if (s[k] != null) opt.textContent = s[k];
 });
 document.title = `${s.title} — Workshop DIY`;
 document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
 document.documentElement.lang = lang;
 const sel = $('langSelect');
 if (sel) sel.value = lang;
 try { localStorage.setItem('wdiy-lang', lang); } catch {}
 log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
 document.documentElement.dataset.theme = name;
 // Toggle shared .light-theme class
 document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
 const sel = $('themeSelect');
 if (sel) sel.value = name;
 const s = LANG[currentLang];
 const label = s['t_' + name] || name;
 try { localStorage.setItem('wdiy-theme', name); } catch {}
 playThemeMelody(name);
 log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;

function log(msg, type = 'info') {
 if (!logContainer) logContainer = $('logContainer');
 if (!logContainer) return;
 const d = document.createElement('div');
 d.className = `log-line ${type}`;
 const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;

 if (typewriterEnabled) {
 logContainer.appendChild(d);
 typewriterAppend(d, fullText);
 } else {
 d.textContent = fullText;
 logContainer.appendChild(d);
 }

 logContainer.scrollTop = logContainer.scrollHeight;
 if (type === 'success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); }
 else if (type === 'error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); }
 logWithHistory(msg, type);
 applyLogFilter();
 resetPetSleep();
}

function clearLog() {
 if (!logContainer) logContainer = $('logContainer');
 if (logContainer) logContainer.innerHTML = '';
 log(LANG[currentLang].logCleared);
}

async function copyLog() {
 if (!logContainer) logContainer = $('logContainer');
 if (!logContainer) return;
 const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
 try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
 catch { log(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;

function showToast(msg, autoHideMs = 0) {
 const el = $('toastIndicator'), t = $('toastMessage');
 if (el && t) {
 t.textContent = msg || LANG[currentLang].working;
 el.style.display = 'block';
 }
 if (toastTimer) clearTimeout(toastTimer);
 if (autoHideMs > 0) {
 toastTimer = setTimeout(hideToast, autoHideMs);
 }
}

function hideToast() {
 const el = $('toastIndicator');
 if (el) el.style.display = 'none';
 if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
 const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
 if (txt) txt.textContent = connected ? s.connected : s.disconnected;
 if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;

function dismissSplash() {
 const s = $('splash');
 if (!s) return;
 s.classList.add('hidden');
 if (splashTimer) clearTimeout(splashTimer);
 setTimeout(() => s.remove(), 600);
 playSound('click');
}

function initSplash() {
 const s = $('splash');
 if (!s) return;
 const sl = $('splashLogo');
 if (sl) sl.innerHTML = LOGO_SVG;
 splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
 const filters = document.querySelectorAll('.log-filter');
 filters.forEach(btn => {
 btn.addEventListener('click', () => {
 filters.forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 activeLogFilter = btn.dataset.filter;
 applyLogFilter();
 playSound('click');
 });
 });
}

function applyLogFilter() {
 if (!logContainer) logContainer = $('logContainer');
 if (!logContainer) return;
 Array.from(logContainer.children).forEach(line => {
 if (activeLogFilter === 'all') { line.style.display = ''; return; }
 line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
 });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
 if (!logContainer) logContainer = $('logContainer');
 if (!logContainer) return;
 const lines = Array.from(logContainer.children).map(d => d.textContent);
 const text = lines.join('\n');
 const blob = new Blob([text], { type: 'text/plain' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `log-${new Date().toISOString().slice(0,10)}.txt`;
 a.click();
 URL.revokeObjectURL(url);
 log(LANG[currentLang].copied, 'success');
 playSound('success');
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
 try {
 const stored = localStorage.getItem('wdiy-latest-version');
 if (stored && stored !== APP_VERSION) {
 // Show update badge on settings button
 const btn = $('settingsBtn');
 if (btn && !btn.querySelector('.version-update')) {
 const badge = document.createElement('span');
 badge.className = 'version-update';
 badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
 btn.style.position = 'relative';
 badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
 btn.appendChild(badge);
 }
 }
 } catch {}
}

// Call this from your deployment/CI to set latest version:
// localStorage.setItem('wdiy-latest-version', '1.3');

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
 try {
 const msg = { type, data, from: document.title, ts: Date.now() };
 localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
 localStorage.removeItem(APP_MSG_KEY); // triggers storage event on other tabs
 } catch {}
}

function onAppMessage(callback) {
 window.addEventListener('storage', e => {
 if (e.key !== APP_MSG_KEY || !e.newValue) return;
 try {
 const msg = JSON.parse(e.newValue);
 callback(msg);
 } catch {}
 });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
 document.addEventListener('keydown', e => {
 if (e.key === KONAMI[konamiIdx]) {
 konamiIdx++;
 if (konamiIdx === KONAMI.length) {
 konamiIdx = 0;
 activateRetroTheme();
 }
 } else {
 konamiIdx = 0;
 }
 });
}

function activateRetroTheme() {
 setTheme('retro');
 log('🕹️ KONAMI CODE ACTIVATED — RETRO MODE!', 'success');
 playSound('success');
}

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
 const bism = document.querySelector('.bismillah');
 if (!bism) return;
 bism.classList.remove('pulse-success', 'pulse-error');
 void bism.offsetWidth; // force reflow
 bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
 setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
 'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
 'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
 'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
 '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
 return text.toLowerCase().split('').map(c => MORSE[c] || '').join('');
}

async function blinkMorse(text) {
 if (morseActive) return;
 morseActive = true;
 const dot = document.querySelector('.status-dot');
 if (!dot) { morseActive = false; return; }
 const orig = dot.style.background;
 const morse = textToMorse(text.replace(/\[.*?\]\s*/g, '')); // strip timestamp
 for (const ch of morse) {
 if (!morseActive) break;
 if (ch === '.') {
 dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
 await sleep(100);
 } else if (ch === '-') {
 dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
 await sleep(300);
 } else if (ch === '/') {
 await sleep(400);
 continue;
 } else if (ch === '') {
 await sleep(200);
 continue;
 }
 dot.style.background = orig; dot.style.boxShadow = '';
 await sleep(100);
 }
 dot.style.background = ''; dot.style.boxShadow = '';
 morseActive = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function initMorseLog() {
 document.addEventListener('mousedown', e => {
 const line = e.target.closest('.log-line');
 if (!line) return;
 morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
 });
 document.addEventListener('mouseup', () => {
 if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
 });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;

const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';

function toggleMatrix() {
 const canvas = $('matrixCanvas');
 if (!canvas) return;
 if (matrixRunning) {
 matrixRunning = false;
 cancelAnimationFrame(matrixAnim);
 canvas.classList.remove('active');
 log('🔴 Matrix rain off', 'info');
 return;
 }
 matrixRunning = true;
 canvas.classList.add('active');
 const ctx = canvas.getContext('2d');
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
 const cols = Math.floor(canvas.width / 16);
 const drops = Array(cols).fill(1);

 function draw() {
 if (!matrixRunning) return;
 ctx.fillStyle = 'rgba(0,0,0,0.05)';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
 ctx.font = '14px Amiri, serif';
 for (let i = 0; i < drops.length; i++) {
 const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
 ctx.fillText(ch, i * 16, drops[i] * 16);
 if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
 drops[i]++;
 }
 matrixAnim = requestAnimationFrame(draw);
 }
 draw();
 log('🟢 Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
 const logo = $('logoWrap');
 if (!logo) return;
 logo.style.cursor = 'pointer';
 logo.addEventListener('click', () => {
 logoClickCount++;
 if (logoClickTimer) clearTimeout(logoClickTimer);
 if (logoClickCount >= 3) {
 logoClickCount = 0;
 toggleMatrix();
 } else {
 logoClickTimer = setTimeout(() => logoClickCount = 0, 500);
 }
 });
}

/* ═══════ DEBUG PANEL (FPS + MEMORY) ═══════ */

function initDebug() {
 if (!new URLSearchParams(window.location.search).has('debug')) return;
 const panel = $('debugPanel');
 if (!panel) return;
 panel.classList.add('active');
 const fpsEl = $('debugFps'), memEl = $('debugMem');
 let frames = 0, lastTime = performance.now();

 function tick() {
 frames++;
 const now = performance.now();
 if (now - lastTime >= 1000) {
 if (fpsEl) fpsEl.textContent = frames + ' FPS';
 if (memEl && performance.memory) {
 memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
 }
 frames = 0;
 lastTime = now;
 }
 requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 log('🐛 Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
 if (!window.DeviceMotionEvent) return;
 let lastShake = 0;
 const THRESHOLD = 25;

 window.addEventListener('devicemotion', e => {
 const acc = e.accelerationIncludingGravity;
 if (!acc) return;
 const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
 if (force > THRESHOLD && Date.now() - lastShake > 2000) {
 lastShake = Date.now();
 generateBugReport();
 }
 });
}

function generateBugReport() {
 if (!logContainer) logContainer = $('logContainer');
 const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
 const report = {
 app: document.title,
 version: APP_VERSION,
 timestamp: new Date().toISOString(),
 userAgent: navigator.userAgent,
 screen: `${screen.width}x${screen.height}`,
 viewport: `${innerWidth}x${innerHeight}`,
 theme: document.documentElement.dataset.theme,
 lang: currentLang,
 log: lines.slice(-50) // last 50 entries
 };
 const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `bug-report-${Date.now()}.json`;
 a.click();
 URL.revokeObjectURL(url);
 log('📱 Bug report exported (shake)', 'success');
 playSound('success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

const logHistory = [];

function logWithHistory(msg, type) {
 logHistory.push({ msg, type, ts: Date.now() });
}

// Time-travel: Ctrl+Z in log panel undoes last log entry
function initTimeTravel() {
 document.addEventListener('keydown', e => {
 if (e.ctrlKey && e.key === 'z') {
 const panel = $('logPanel');
 if (!panel || !panel.classList.contains('open')) return;
 e.preventDefault();
 if (!logContainer) logContainer = $('logContainer');
 if (logContainer && logContainer.lastChild) {
 logContainer.removeChild(logContainer.lastChild);
 logHistory.pop();
 playSound('click');
 }
 }
 });
}

/* ═══════ TYPEWRITER LOG MODE ═══════ */

let typewriterEnabled = true;

async function typewriterAppend(element, text) {
 element.classList.add('typing');
 element.textContent = '';
 for (let i = 0; i < text.length; i++) {
 element.textContent += text[i];
 if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
 await sleep(12 + Math.random() * 18);
 }
 element.classList.remove('typing');
}

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
 // Approximate Hijri conversion (Kuwaiti algorithm)
 const d = new Date();
 const jd = Math.floor((11 * d.getFullYear() + 3) / 30) + 354 * d.getFullYear() +
 30 * Math.floor((d.getMonth() + 1 - 1) / 2) + Math.floor(d.getDate() / 2) - 385;

 // Use Intl if available (much more accurate)
 try {
 const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
 day: 'numeric', month: 'long', year: 'numeric'
 }).format(d);
 return hijri;
 } catch {
 return '';
 }
}

function initHijriDate() {
 const el = $('hijriDate');
 if (!el) return;
 const h = calcHijriDate();
 if (h) el.textContent = h;
}

/* ═══════ WHISPER MODE (Voice-to-Log) ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
 if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
 log('🎤 Speech not supported in this browser', 'error');
 return;
 }
 if (whisperActive) {
 if (recognition) recognition.stop();
 whisperActive = false;
 log('🎤 Whisper mode off', 'info');
 return;
 }
 const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
 recognition = new SR();
 recognition.continuous = true;
 recognition.interimResults = false;
 recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';

 recognition.onresult = e => {
 for (let i = e.resultIndex; i < e.results.length; i++) {
 if (e.results[i].isFinal) {
 const text = e.results[i][0].transcript.trim();
 if (text) log(`🎤 ${text}`, 'rx');
 }
 }
 };
 recognition.onerror = e => log(`🎤 Error: ${e.error}`, 'error');
 recognition.onend = () => { if (whisperActive) recognition.start(); };

 recognition.start();
 whisperActive = true;
 log('🎤 Whisper mode on — speak!', 'success');
}

/* ═══════ GHOST USERS (cross-tab cursors) ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
 ghostCanvas = document.createElement('canvas');
 ghostCanvas.className = 'ghost-canvas';
 ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
 document.body.appendChild(ghostCanvas);
 ghostCtx = ghostCanvas.getContext('2d');
 ghostCanvas.width = innerWidth;
 ghostCanvas.height = innerHeight;

 window.addEventListener('resize', () => {
 ghostCanvas.width = innerWidth;
 ghostCanvas.height = innerHeight;
 });

 // Broadcast my cursor
 document.addEventListener('mousemove', e => {
 try {
 localStorage.setItem(GHOST_KEY, JSON.stringify({
 id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now()
 }));
 } catch {}
 });

 // Listen for other cursors
 const ghosts = {};
 window.addEventListener('storage', e => {
 if (e.key !== GHOST_KEY || !e.newValue) return;
 try {
 const d = JSON.parse(e.newValue);
 if (d.id === myGhostId) return;
 ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
 } catch {}
 });

 // Render ghosts
 function drawGhosts() {
 ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
 const now = Date.now();
 const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
 for (const [id, g] of Object.entries(ghosts)) {
 if (now - g.ts > 3000) { delete ghosts[id]; continue; }
 const age = (now - g.ts) / 3000;
 ghostCtx.globalAlpha = 0.3 * (1 - age);
 ghostCtx.beginPath();
 ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
 ghostCtx.fillStyle = accent;
 ghostCtx.fill();
 // tiny trail
 ghostCtx.beginPath();
 ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
 ghostCtx.fillStyle = '#fff';
 ghostCtx.fill();
 }
 ghostCtx.globalAlpha = 1;
 requestAnimationFrame(drawGhosts);
 }
 requestAnimationFrame(drawGhosts);
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
 'mosque-gold': [330, 392, 523], // E4 G4 C5 — majestic
 'zellige': [440, 523, 659], // A4 C5 E5 — bright
 'andalus': [294, 370, 440], // D4 F#4 A4 — warm
 'space': [523, 659, 784], // C5 E5 G5 — dreamy
 'jungle': [262, 330, 392], // C4 E4 G4 — earthy
 'robot': [440, 554, 659], // A4 C#5 E5 — techy
 'riad': [349, 440, 523], // F4 A4 C5 — serene
 'medina': [294, 349, 440], // D4 F4 A4 — calm
 'retro': [523, 262, 523], // C5 C4 C5 — retro beep
};

function playThemeMelody(themeName) {
 if (!soundEnabled) return;
 if (!audioCtx) audioCtx = new AudioCtx();
 const notes = THEME_MELODIES[themeName];
 if (!notes) return;
 const t = audioCtx.currentTime;
 notes.forEach((freq, i) => {
 const osc = audioCtx.createOscillator();
 const gain = audioCtx.createGain();
 osc.connect(gain); gain.connect(audioCtx.destination);
 osc.type = 'sine';
 osc.frequency.value = freq;
 gain.gain.value = 0.06;
 gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
 osc.start(t + i * 0.15);
 osc.stop(t + i * 0.15 + 0.2);
 });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
 const bands = document.querySelectorAll('.deco-band');
 breathingActive = !breathingActive;

 if (breathingActive) {
 bands.forEach(b => b.classList.add('breathing'));
 log('🫁 Breathing guide on — inhale... exhale...', 'info');
 } else {
 bands.forEach(b => b.classList.remove('breathing'));
 if (dhikrCount > 0) log(`📿 Dhikr count: ${dhikrCount}`, 'success');
 dhikrCount = 0;
 log('🫁 Breathing guide off', 'info');
 }
}

function incrementDhikr() {
 if (!breathingActive) return;
 dhikrCount++;
 playSound('click');
 const counter = $('dhikrCounter');
 if (counter) counter.textContent = dhikrCount;
}

/* ═══════ PIXEL PET (Animated Logo) ═══════ */

const PET_STATES = {
 idle: { class: 'pet-idle', duration: 0 },
 happy: { class: 'pet-happy', duration: 3000 },
 sad: { class: 'pet-sad', duration: 3000 },
 sleep: { class: 'pet-sleep', duration: 0 },
};

let petState = 'idle';
let petFrame = 0;
let petTimer = null;
let petIdleTimer = null;

function initPixelPet() {
 const pet = document.createElement('div');
 pet.id = 'pixelPet';
 pet.className = 'pixel-pet pet-idle';
 pet.title = 'Click me!';
 pet.innerHTML = `<img src="${FOOTER_ICON}" alt="Bot" />`;
 pet.addEventListener('click', () => {
 setPetState('happy');
 playSound('success');
 });
 const footer = document.querySelector('.app-footer');
 if (footer) footer.insertBefore(pet, footer.firstChild);
}

function setPetState(state) {
 petState = state;
 const pet = $('pixelPet');
 if (!pet) return;
 // Remove all state classes
 pet.classList.remove('pet-idle', 'pet-happy', 'pet-sad', 'pet-sleep');
 pet.classList.add(PET_STATES[state].class);
 // Auto-return to idle
 if (petIdleTimer) clearTimeout(petIdleTimer);
 const dur = PET_STATES[state].duration;
 if (dur > 0) {
 petIdleTimer = setTimeout(() => setPetState('idle'), dur);
 }
}

// Pet goes to sleep after 60s of no log activity
let petSleepTimer = null;
function resetPetSleep() {
 if (petSleepTimer) clearTimeout(petSleepTimer);
 if (petState === 'sleep') setPetState('idle');
 petSleepTimer = setTimeout(() => setPetState('sleep'), 60000);
}

/* ═══════ NIGHT MODE (sunset auto-detect) ═══════ */

function initNightMode() {
 // Calculate approximate sunset using date + rough estimate
 // More accurate with geolocation, but works without it
 const hour = new Date().getHours();
 const isNight = hour >= 21 || hour < 6;

 if (isNight) {
 // Only auto-apply if user hasn't manually set a theme
 try {
 const manual = localStorage.getItem('wdiy-theme');
 if (!manual) {
 setTheme('mosque-gold'); // calm dark theme
 log('🌙 Night mode — time to rest', 'info');
 }
 } catch {}
 }

 // Try geolocation for more precise sunset
 if ('geolocation' in navigator) {
 navigator.geolocation.getCurrentPosition(pos => {
 const sunset = calcSunset(pos.coords.latitude, pos.coords.longitude);
 const now = new Date();
 const nowMins = now.getHours() * 60 + now.getMinutes();
 if (nowMins >= sunset || nowMins < 360) { // after sunset or before 6am
 try {
 const manual = localStorage.getItem('wdiy-theme');
 if (!manual) {
 setTheme('mosque-gold');
 log('🌙 Night detected — sweet dreams', 'info');
 }
 } catch {}
 }
 }, () => {}, { timeout: 3000 });
 }
}

function calcSunset(lat, lng) {
 // Simplified sunset calculation (returns minutes since midnight)
 const d = new Date();
 const N = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
 const radLat = lat * Math.PI / 180;
 const decl = -23.45 * Math.cos(2 * Math.PI / 365 * (N + 10)) * Math.PI / 180;
 const ha = Math.acos(-Math.tan(radLat) * Math.tan(decl)) * 180 / Math.PI;
 const sunset = 720 + (ha * 4) - (lng * 4) + (d.getTimezoneOffset());
 return Math.round(sunset);
}

/* ═══════ LOGO FOLLOWS CURSOR (magnetic eyes) ═══════ */

function initLogoTracker() {
 const logo = $('logoWrap');
 if (!logo) return;
 
 document.addEventListener('mousemove', e => {
 const rect = logo.getBoundingClientRect();
 const cx = rect.left + rect.width / 2;
 const cy = rect.top + rect.height / 2;
 const dx = (e.clientX - cx) / (innerWidth / 2);
 const dy = (e.clientY - cy) / (innerHeight / 2);
 const angle = Math.atan2(dy, dx) * (180 / Math.PI);
 const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
 
 const tiltX = dy * 8; // max 8deg
 const tiltY = -dx * 8;
 const shift = dist * 4; // max 4px shift
 
 logo.style.transform = `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dx * shift}px) translateY(${dy * shift}px)`;
 });
 
 // Pupil dilate on click
 logo.addEventListener('mousedown', () => {
 logo.style.transition = 'transform .1s';
 logo.style.transform += ' scale(1.15)';
 setTimeout(() => { logo.style.transition = ''; }, 150);
 });
 logo.addEventListener('mouseup', () => {
 logo.style.transition = 'transform .2s';
 setTimeout(() => { logo.style.transition = ''; }, 200);
 });
 
 // Reset on mouse leave
 document.addEventListener('mouseleave', () => {
 logo.style.transition = 'transform .5s ease-out';
 logo.style.transform = '';
 setTimeout(() => { logo.style.transition = ''; }, 500);
 });
}

/* ═══════ MUSIC REACTIVE (live audio visualizer) ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
 if (musicActive) {
 musicActive = false;
 if (musicAnim) cancelAnimationFrame(musicAnim);
 document.querySelectorAll('.deco-band').forEach(b => {
 b.style.height = ''; b.style.opacity = ''; b.style.background = '';
 });
 document.querySelectorAll('.card').forEach(c => c.style.transform = '');
 log('🎵 Music mode off', 'info');
 return;
 }
 
 navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
 if (!audioCtx) audioCtx = new AudioCtx();
 const source = audioCtx.createMediaStreamSource(stream);
 musicAnalyser = audioCtx.createAnalyser();
 musicAnalyser.fftSize = 256;
 source.connect(musicAnalyser);
 
 musicActive = true;
 log('🎵 Music mode on — play some music!', 'success');
 
 const data = new Uint8Array(musicAnalyser.frequencyBinCount);
 const bands = document.querySelectorAll('.deco-band');
 const cards = document.querySelectorAll('.card');
 const root = document.documentElement;
 
 function visualize() {
 if (!musicActive) return;
 musicAnalyser.getByteFrequencyData(data);
 
 // Average bass (0-10), mid (10-50), treble (50+)
 const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
 const mid = data.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255;
 const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
 
 // Deco bands = live equalizer
 bands.forEach((b, i) => {
 const v = i === 0 ? bass : treble;
 b.style.height = (2 + v * 10) + 'px';
 b.style.opacity = 0.4 + v * 0.6;
 });
 
 // Cards pulse to bass
 cards.forEach(c => {
 c.style.transform = `scale(${1 + bass * 0.015})`;
 c.style.transition = 'transform 0.05s';
 });
 
 // Hue shift with frequency
 const hue = Math.round(mid * 60);
 root.style.filter = `hue-rotate(${hue}deg)`;
 
 musicAnim = requestAnimationFrame(visualize);
 }
 visualize();
 }).catch(() => {
 log('🎵 Microphone access denied', 'error');
 });
}

/* ═══════ AR MODE (WebXR overlay) ═══════ */

function initAR() {
 // Check WebXR support
 if (!navigator.xr) return;
 
 navigator.xr.isSessionSupported('immersive-ar').then(supported => {
 if (!supported) return;
 
 // Add AR button to header
 const btns = document.querySelector('.header-buttons');
 if (!btns) return;
 const arBtn = document.createElement('button');
 arBtn.className = 'btn-icon-only';
 arBtn.setAttribute('aria-label', 'AR Mode');
 arBtn.textContent = '📷';
 arBtn.onclick = startAR;
 btns.appendChild(arBtn);
 log('📷 AR mode available!', 'info');
 }).catch(() => {});
}

async function startAR() {
 try {
 const session = await navigator.xr.requestSession('immersive-ar', {
 requiredFeatures: ['hit-test'],
 optionalFeatures: ['dom-overlay'],
 domOverlay: { root: document.querySelector('.app') }
 });
 log('📷 AR session started!', 'success');
 
 session.addEventListener('end', () => {
 log('📷 AR session ended', 'info');
 });
 } catch (e) {
 log(`📷 AR failed: ${e.message}`, 'error');
 }
}

/* ═══════ AI CHAT (app talks back) ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
 const s = LANG[currentLang];
 chatHistory.push({ role: 'user', content: userMsg });
 
 log(`💬 You: ${userMsg}`, 'tx');
 
 try {
 const systemPrompt = `You are the Workshop-DIY robot assistant embedded in a kids educational app. You are geeky, funny (clean humor), and helpful. Keep responses SHORT (1-2 sentences max). Current language: ${currentLang}. Current theme: ${document.documentElement.dataset.theme}. You know about MQTT, IoT, ESP32, micro:bit, and coding. You respect Islamic values. Never be mean. Be encouraging. Add relevant emojis.`;
 
 const resp = await fetch('https://api.anthropic.com/v1/messages', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 model: 'claude-sonnet-4-20250514',
 max_tokens: 150,
 system: systemPrompt,
 messages: chatHistory.slice(-10) // keep context short
 })
 });
 
 const data = await resp.json();
 const reply = data.content?.[0]?.text || '🤖 ...';
 chatHistory.push({ role: 'assistant', content: reply });
 log(`🤖 ${reply}`, 'rx');
 playSound('success');
 setPetState('happy');
 } catch (e) {
 log('🤖 Brain offline — check connection', 'error');
 setPetState('sad');
 }
}

function initAIChat() {
 // Add chat input to log panel footer
 const logFooter = document.querySelector('#logPanel .sidebar-footer');
 if (!logFooter) return;
 
 const chatRow = document.createElement('div');
 chatRow.className = 'chat-input-row';
 chatRow.innerHTML = `
 <input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." data-i18n-placeholder="chatPlaceholder" />
 <button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">🤖</span></button>
 `;
 logFooter.parentElement.insertBefore(chatRow, logFooter);
 
 const input = $('chatInput');
 const sendBtn = $('chatSendBtn');
 
 const send = () => {
 const msg = input.value.trim();
 if (!msg) return;
 input.value = '';
 aiRespond(msg);
 };
 
 if (sendBtn) sendBtn.onclick = send;
 if (input) input.addEventListener('keydown', e => {
 if (e.key === 'Enter') send();
 });
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
 const handle = $('logResizeHandle');
 const panel = $('logPanel');
 if (!handle || !panel) return;

 let dragging = false;
 let startX, startW;
 const isRtl = () => document.documentElement.dir === 'rtl';

 handle.addEventListener('mousedown', e => {
 dragging = true;
 startX = e.clientX;
 startW = panel.offsetWidth;
 handle.classList.add('active');
 document.body.style.cursor = 'col-resize';
 document.body.style.userSelect = 'none';
 e.preventDefault();
 });

 document.addEventListener('mousemove', e => {
 if (!dragging) return;
 const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
 const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
 document.documentElement.style.setProperty('--log-width', newW + 'px');
 });

 document.addEventListener('mouseup', () => {
 if (!dragging) return;
 dragging = false;
 handle.classList.remove('active');
 document.body.style.cursor = '';
 document.body.style.userSelect = '';
 try {
 const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
 localStorage.setItem('wdiy-log-width', w);
 } catch {}
 });

 // Touch support
 handle.addEventListener('touchstart', e => {
 dragging = true;
 startX = e.touches[0].clientX;
 startW = panel.offsetWidth;
 handle.classList.add('active');
 e.preventDefault();
 }, { passive: false });

 document.addEventListener('touchmove', e => {
 if (!dragging) return;
 const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
 const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
 document.documentElement.style.setProperty('--log-width', newW + 'px');
 }, { passive: true });

 document.addEventListener('touchend', () => {
 if (!dragging) return;
 dragging = false;
 handle.classList.remove('active');
 try {
 const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
 localStorage.setItem('wdiy-log-width', w);
 } catch {}
 });

 // Restore saved width
 try {
 const saved = localStorage.getItem('wdiy-log-width');
 if (saved) document.documentElement.style.setProperty('--log-width', saved);
 } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
 const sb = $(panelId), ov = $(overlayId);
 if (sb) sb.classList.add('open');
 if (ov) ov.classList.add('open');
 if (sb) {
 const first = sb.querySelector(FOCUSABLE);
 if (first) first.focus();
 }
}

function closePanel(panelId, overlayId, returnFocusId) {
 const sb = $(panelId), ov = $(overlayId);
 if (sb) sb.classList.remove('open');
 if (ov) ov.classList.remove('open');
 const btn = $(returnFocusId);
 if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;

function openSettings() {
 // If log is docked, remember and close it temporarily
 const logEl = $('logPanel');
 logWasOpen = logEl && logEl.classList.contains('open');
 if (logWasOpen) closeLog();
 openPanel('settingsPanel', 'settingsOverlay');
}
function closeSettings() {
 closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
 // Restore log if it was open before
 if (logWasOpen) { openLog(); logWasOpen = false; }
}
function openLog() {
 const sb = $('logPanel');
 if (sb) sb.classList.add('open');
 document.body.classList.add('log-open');
}
function closeLog() {
 const sb = $('logPanel');
 if (sb) sb.classList.remove('open');
 document.body.classList.remove('log-open');
 const btn = $('logBtn');
 if (btn) btn.focus();
}

function toggleLog() {
 const sb = $('logPanel');
 if (sb && sb.classList.contains('open')) closeLog();
 else openLog();
}

function closeAllPanels() {
 closeHelp();
 closeSettings();
 closeLog();
}

function initHelpTabs() {
 const tabs = document.querySelectorAll('.help-tab');
 const contents = document.querySelectorAll('.help-content');
 tabs.forEach(tab => {
 tab.addEventListener('click', () => {
 tabs.forEach(t => t.classList.remove('active'));
 contents.forEach(c => c.classList.remove('active'));
 tab.classList.add('active');
 const tabName = tab.dataset.tab;
 const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
 const target = $(targetId);
 if (target) target.classList.add('active');
 });
 });
}

function trapFocus(e) {
 for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
 const sb = $(id);
 if (!sb || !sb.classList.contains('open')) continue;
 const focusable = sb.querySelectorAll(FOCUSABLE);
 if (!focusable.length) return;
 const first = focusable[0], last = focusable[focusable.length - 1];
 if (e.shiftKey && document.activeElement === first) {
 e.preventDefault(); last.focus();
 } else if (!e.shiftKey && document.activeElement === last) {
 e.preventDefault(); first.focus();
 }
 return;
 }
}

/* ═══════ EXTRACTION BEACON SIMULATION ═══════ */

let beaconState = 'standby'; // standby | broadcasting | acknowledged
let beaconInterval = null;
let beaconTimerInterval = null;
let beaconStartTime = null;
let beaconBroadcastCount = 0;
let rescueTimeout = null;

const PRIORITY_CONFIG = {
 low: { color: '#44cc44', speed: '3s', interval: 5000, responseMin: 15000, responseMax: 30000 },
 medium: { color: '#cccc00', speed: '2s', interval: 3000, responseMin: 8000, responseMax: 20000 },
 high: { color: '#ff8800', speed: '1.2s', interval: 2000, responseMin: 4000, responseMax: 12000 },
 mayday: { color: '#ff0000', speed: '0.6s', interval: 1000, responseMin: 2000, responseMax: 6000 },
};

const STATUS_CODES = { ok: 0x00, injured: 0x01, compromised: 0x02, underfire: 0x03 };
const PRIORITY_CODES = { low: 0x00, medium: 0x01, high: 0x02, mayday: 0x03 };

function encodeFrame(agentId, status, priority, grid) {
 const bytes = [];
 // Header byte: 0xE0 | priority
 bytes.push(0xE0 | (PRIORITY_CODES[priority] & 0x03));
 // Status byte
 bytes.push(STATUS_CODES[status] || 0x00);
 // Agent ID: encode each char as ASCII byte (padded to 8 bytes)
 const idStr = agentId.toUpperCase().padEnd(8, '\0').slice(0, 8);
 for (let i = 0; i < 8; i++) bytes.push(idStr.charCodeAt(i) & 0xFF);
 // Grid: encode each char (padded to 12 bytes)
 const gridStr = grid.padEnd(12, '\0').slice(0, 12);
 for (let i = 0; i < 12; i++) bytes.push(gridStr.charCodeAt(i) & 0xFF);
 // Timestamp (2 bytes, minutes since midnight)
 const now = new Date();
 const mins = now.getHours() * 60 + now.getMinutes();
 bytes.push((mins >> 8) & 0xFF);
 bytes.push(mins & 0xFF);
 // Checksum (XOR of all previous bytes)
 let chk = 0;
 for (const b of bytes) chk ^= b;
 bytes.push(chk);
 return bytes;
}

function bytesToHex(bytes) {
 return bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
}

function setBeaconState(state) {
 beaconState = state;
 const display = $('beaconStatus');
 const valueEl = $('beaconValue');
 const s = LANG[currentLang];
 if (display) {
 display.className = 'beacon-display ' + state;
 }
 if (valueEl) {
 valueEl.textContent = s[state] || state.toUpperCase();
 }
}

function updatePulseDisplay(priority) {
 const pulse = $('pulseDisplay');
 if (!pulse) return;
 const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
 pulse.style.color = cfg.color;
 pulse.style.setProperty('--pulse-speed', cfg.speed);
 if (beaconState === 'broadcasting') {
 pulse.classList.add('active');
 } else {
 pulse.classList.remove('active');
 }
}

function updateResponseTimer() {
 if (!beaconStartTime) return;
 const elapsed = Date.now() - beaconStartTime;
 const h = Math.floor(elapsed / 3600000);
 const m = Math.floor((elapsed % 3600000) / 60000);
 const sec = Math.floor((elapsed % 60000) / 1000);
 const timerEl = $('responseTimer');
 if (timerEl) {
 timerEl.textContent =
 String(h).padStart(2, '0') + ':' +
 String(m).padStart(2, '0') + ':' +
 String(sec).padStart(2, '0');
 }
}

function activateBeacon() {
 const agentId = ($('agentIdInput') || {}).value || '';
 const status = ($('statusSelect') || {}).value || 'ok';
 const priority = ($('prioritySelect') || {}).value || 'low';
 const grid = ($('gridInput') || {}).value || '';
 const s = LANG[currentLang];

 if (!agentId.trim() || !grid.trim()) {
 log(s.fillRequired, 'error');
 showToast(s.fillRequired, 2500);
 playSound('error');
 return;
 }

 // Stop any existing beacon
 cancelBeacon(true);

 // Encode the frame
 const frame = encodeFrame(agentId, status, priority, grid);
 const hexStr = bytesToHex(frame);

 // Update displays
 setBeaconState('broadcasting');
 setStatus(true);
 updatePulseDisplay(priority);

 const frameEl = $('frameDisplay');
 if (frameEl) frameEl.textContent = hexStr;

 // Start timer
 beaconStartTime = Date.now();
 beaconBroadcastCount = 1;
 beaconTimerInterval = setInterval(updateResponseTimer, 100);

 // Log activation
 log(s.beaconActivated, 'success');
 log(`${s.txFrame} ${hexStr}`, 'tx');
 playSound('success');

 // Periodic re-broadcast
 const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
 beaconInterval = setInterval(() => {
 beaconBroadcastCount++;
 const reFrame = encodeFrame(agentId, status, priority, grid);
 const reHex = bytesToHex(reFrame);
 if (frameEl) frameEl.textContent = reHex;
 log(`${s.repeatBroadcast}${beaconBroadcastCount}`, 'tx');
 playSound('click');
 }, cfg.interval);

 // Simulated rescue acknowledgment
 const delay = cfg.responseMin + Math.random() * (cfg.responseMax - cfg.responseMin);
 rescueTimeout = setTimeout(() => {
 setBeaconState('acknowledged');
 updatePulseDisplay(priority);
 log(s.rescueAck, 'success');
 showToast(s.rescueAck, 5000);
 playSound('success');
 // Stop repeating after acknowledgment
 if (beaconInterval) { clearInterval(beaconInterval); beaconInterval = null; }
 }, delay);
}

function cancelBeacon(silent) {
 if (beaconInterval) { clearInterval(beaconInterval); beaconInterval = null; }
 if (beaconTimerInterval) { clearInterval(beaconTimerInterval); beaconTimerInterval = null; }
 if (rescueTimeout) { clearTimeout(rescueTimeout); rescueTimeout = null; }
 beaconStartTime = null;
 beaconBroadcastCount = 0;

 setBeaconState('standby');
 setStatus(false);
 updatePulseDisplay('low');

 const timerEl = $('responseTimer');
 if (timerEl) timerEl.textContent = '00:00:00';
 const frameEl = $('frameDisplay');
 if (frameEl) frameEl.textContent = '--';

 if (!silent) {
 const s = LANG[currentLang];
 log(s.beaconCancelled, 'error');
 playSound('error');
 }
}

function initBeacon() {
 const actBtn = $('activateBtn');
 const canBtn = $('cancelBtn');
 if (actBtn) actBtn.onclick = activateBeacon;
 if (canBtn) canBtn.onclick = () => cancelBeacon(false);

 // Priority change updates pulse preview
 const prioSel = $('prioritySelect');
 if (prioSel) {
 prioSel.addEventListener('change', () => {
 if (beaconState !== 'broadcasting') {
 updatePulseDisplay(prioSel.value);
 }
 });
 }

 // i18n for select options
 const updateSelectI18n = () => {
 const s = LANG[currentLang];
 document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
 const k = opt.dataset.i18nOpt;
 if (s[k] != null) opt.textContent = s[k];
 });
 };
 updateSelectI18n();
}

/* ═══════ INIT ═══════ */

function init() {
 // Splash
 initSplash();

 // Inject logo
 const lw = $('logoWrap');
 if (lw) lw.innerHTML = LOGO_SVG;

 // Log buttons
 const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
 if (cb) cb.onclick = clearLog;
 if (cpb) cpb.onclick = copyLog;
 if (exb) exb.onclick = exportLog;
 initLogFilters();

 // Help panel (left)
 const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
 if (hBtn) hBtn.onclick = openHelp;
 if (hClose) hClose.onclick = closeHelp;
 if (hOv) hOv.onclick = closeHelp;
 initHelpTabs();

 // Settings panel (right)
 const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
 if (sBtn) sBtn.onclick = openSettings;
 if (sClose) sClose.onclick = closeSettings;
 if (sOv) sOv.onclick = closeSettings;

 // Log panel (right, docked)
 const lBtn = $('logBtn'), lClose = $('logCloseBtn');
 if (lBtn) lBtn.onclick = toggleLog;
 if (lClose) lClose.onclick = closeLog;
 initLogResize();

 // Sound toggle
 const soundTgl = $('soundToggle');
 if (soundTgl) {
 try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
 soundTgl.checked = soundEnabled;
 soundTgl.addEventListener('change', () => {
 soundEnabled = soundTgl.checked;
 try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
 if (soundEnabled) playSound('click');
 });
 }

 // Whisper mode
 const whisperBtn = $('whisperBtn');
 if (whisperBtn) whisperBtn.onclick = toggleWhisper;

 // Breathing guide + dhikr
 const breathBtn = $('breathingBtn');
 const dhikrDisp = $('dhikrDisplay');
 const dhikrBtn = $('dhikrBtn');
 if (breathBtn) breathBtn.onclick = () => {
 toggleBreathing();
 if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
 };
 if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

 // Music mode
 const musicBtn = $('musicBtn');
 if (musicBtn) musicBtn.onclick = toggleMusicMode;

 // Escape key + focus trap
 document.addEventListener('keydown', e => {
 if (e.key === 'Escape') closeAllPanels();
 if (e.key === 'Tab') trapFocus(e);
 });

 // Language dropdown
 const langSel = $('langSelect');
 if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));

 // Theme dropdown
 const themeSel = $('themeSelect');
 if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

 // Restore saved preferences
 try {
 const savedLang = localStorage.getItem('wdiy-lang');
 const savedTheme = localStorage.getItem('wdiy-theme');
 if (savedTheme) setTheme(savedTheme);
 if (savedLang) setLanguage(savedLang);
 } catch {}

 // Version check
 checkVersion();

 // App messaging listener
 onAppMessage(msg => {
 log(`📨 ${msg.from}: ${msg.type}`, 'rx');
 });

 // Geeky features
 initKonami();
 initMorseLog();
 initMatrixTrigger();
 initDebug();
 initShakeReport();
 initTimeTravel();
 initHijriDate();

 // Magic features
 initGhostUsers();
 initPixelPet();
 initNightMode();
 initLogoTracker();
 initAR();
 initAIChat();

 // Extraction beacon simulation
 initBeacon();

 log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading'
 ? document.addEventListener('DOMContentLoaded', init)
 : init();

// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
 if (e.target.classList.contains('code-tab')) {
 var tabs = e.target.parentElement;
 tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
 e.target.classList.add('active');
 var target = e.target.getAttribute('data-codetarget');
 var card = tabs.closest('.card');
 card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
 var show = card.querySelector('#code-' + target);
 if (show) show.classList.remove('hidden');
 }
});

var DEMO_STEPS = [
 {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#settingsCloseBtn', delay:3000},
 {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#whisperBtn', delay:3000},
 {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#breathingBtn', delay:3000},
 {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
 {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
 _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
 demoShow();
}

function demoToggle() {
 _demoPlaying = !_demoPlaying;
 var btn = document.getElementById('demoPlayBtn');
 if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
 if (_demoPlaying) {
 demoShow();
 _demoTimer = setInterval(function() {
 if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
 else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
 }, 3000);
 } else {
 clearInterval(_demoTimer);
 }
}

function demoShow() {
 var step = _demoSteps[_demoStep];
 if (!step) return;
 var numEl = document.getElementById('demoCurrentStep');
 var narEl = document.getElementById('demoNarration');
 var barEl = document.getElementById('demoProgressBar');
 if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
 if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
 if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
 // Remove old highlights
 document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
 // Add highlight
 if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
 navigator.serviceWorker.register('sw.js').catch(function(){});
}
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){initTooltips();initExplorer();});}else{initTooltips();initExplorer();}

/* ═══════ PEER MODE (BroadcastChannel) ═══════ */
function initPeerMode(){var L=LANG[document.documentElement.lang||'en'];if(!L.peerTitle)return;if(typeof BroadcastChannel==='undefined'){console.warn('BroadcastChannel not available');return;}var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var channelName='peer_'+appDir;var bc=new BroadcastChannel(channelName);var peerActive=false;var msgCount=0;var container=document.getElementById('peerModePanel');if(!container){container=document.createElement('div');container.id='peerModePanel';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var anchor=document.getElementById('dailyChallenge');if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(container,anchor);}else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}container.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span style="font-size:0.95rem;font-weight:700;" data-i18n="peerTitle">'+L.peerTitle+'</span>'+'<button id="peerToggleBtn" class="btn-sm" style="padding:0.3rem 0.8rem;border-radius:16px;cursor:pointer;" data-i18n="peerConnect">'+L.peerConnect+'</button>'+'<span id="peerStatusDot" style="font-size:0.85rem;">\ud83d\udd34 Solo</span>'+'<span id="peerMsgCount" style="font-size:0.75rem;opacity:0.6;margin-left:auto;">0 synced</span></div>'+'<p style="font-size:0.7rem;opacity:0.5;margin:0.3rem 0 0;" data-i18n="peerInfo">'+L.peerInfo+'</p>';var btn=document.getElementById('peerToggleBtn');var dot=document.getElementById('peerStatusDot');var counter=document.getElementById('peerMsgCount');btn.onclick=function(){peerActive=!peerActive;if(peerActive){btn.textContent=L.peerDisconnect||'Disconnect';dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');bc.postMessage({type:'ping'});}else{btn.textContent=L.peerConnect||'Connect';dot.textContent='\ud83d\udd34 Solo';}};bc.onmessage=function(e){if(!peerActive)return;var d=e.data;if(d&&d.type==='param'){var el=document.querySelector('[name="'+d.name+'"],#'+d.name);if(el&&el.type==='range'){el.value=d.value;el.dispatchEvent(new Event('input',{bubbles:true}));}msgCount++;counter.textContent=msgCount+' synced';}if(d&&d.type==='ping'){dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');}};document.querySelectorAll('input[type="range"]').forEach(function(slider){slider.addEventListener('input',function(){if(!peerActive)return;var nm=slider.name||slider.id||'';if(!nm)return;bc.postMessage({type:'param',name:nm,value:slider.value});msgCount++;counter.textContent=msgCount+' synced';});});}

/* ═══════ ACTIVITY HEATMAP ═══════ */
function initActivityHeatmap(){var L=LANG[document.documentElement.lang||'en'];if(!L.heatmapTitle)return;var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey='activity_'+appDir;var data;try{data=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch(e){data={};}if(!data.dates)data.dates={};var today=new Date().toISOString().slice(0,10);data.dates[today]=(data.dates[today]||0)+1;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}var container=document.getElementById('activityHeatmap');if(!container){container=document.createElement('div');container.id='activityHeatmap';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var peer=document.getElementById('peerModePanel');if(peer&&peer.parentNode){peer.parentNode.insertBefore(container,peer.nextSibling);}else{var dc=document.getElementById('dailyChallenge');if(dc&&dc.parentNode)dc.parentNode.insertBefore(container,dc);else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}}var colors=['#161b22','#0e4429','#006d32','#26a641','#39d353'];function getColor(n){if(n===0)return colors[0];if(n===1)return colors[1];if(n<=3)return colors[2];if(n<=5)return colors[3];return colors[4];}var canvas=document.createElement('canvas');canvas.width=280;canvas.height=100;canvas.style.cssText='width:280px;max-width:100%;height:100px;border-radius:6px;cursor:pointer;display:block;margin:0.4rem 0;';var ctx=canvas.getContext('2d');var cellSize=10;var gap=2;var todayDate=new Date();todayDate.setHours(0,0,0,0);var startDate=new Date(todayDate);startDate.setDate(startDate.getDate()-(52*7-1));var tooltip=document.createElement('div');tooltip.style.cssText='display:none;position:absolute;z-index:9999;background:#1a1a2e;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;pointer-events:none;white-space:nowrap;';container.style.position='relative';container.appendChild(tooltip);var cellMap=[];function drawGrid(){ctx.clearRect(0,0,280,100);var d=new Date(startDate);for(var week=0;week<52;week++){for(var day=0;day<7;day++){var ds=d.toISOString().slice(0,10);var count=data.dates[ds]||0;var x=week*(cellSize+gap);var y=day*(cellSize+gap);ctx.fillStyle=getColor(count);ctx.fillRect(x,y,cellSize,cellSize);if(ds===today){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,cellSize-1,cellSize-1);}cellMap.push({x:x,y:y,date:ds,count:count});d.setDate(d.getDate()+1);}}}drawGrid();canvas.addEventListener('click',function(e){var rect=canvas.getBoundingClientRect();var scaleX=280/rect.width;var mx=(e.clientX-rect.left)*scaleX;var my=(e.clientY-rect.top)*(100/rect.height);for(var i=0;i<cellMap.length;i++){var c=cellMap[i];if(mx>=c.x&&mx<=c.x+cellSize&&my>=c.y&&my<=c.y+cellSize){tooltip.textContent=c.date+': '+c.count+' visits';tooltip.style.display='block';tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+10)+'px';tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-20)+'px';setTimeout(function(){tooltip.style.display='none';},2500);return;}}});var streak=0;var checkDate=new Date(todayDate);while(true){var ds=checkDate.toISOString().slice(0,10);if(data.dates[ds]&&data.dates[ds]>0){streak++;}else{break;}checkDate.setDate(checkDate.getDate()-1);}var totalSessions=0;Object.values(data.dates).forEach(function(v){totalSessions+=v;});var stats=document.createElement('div');stats.style.cssText='font-size:0.75rem;opacity:0.7;display:flex;gap:1rem;flex-wrap:wrap;';stats.innerHTML='<span data-i18n="heatmapToday">'+(L.heatmapToday||'Today')+'</span>: '+(data.dates[today]||0)+' | '+'<span data-i18n="heatmapStreak">'+(L.heatmapStreak||'Streak')+'</span>: '+streak+' days | '+'<span data-i18n="heatmapTotal">'+(L.heatmapTotal||'Total')+'</span>: '+totalSessions;var legend=document.createElement('div');legend.style.cssText='font-size:0.65rem;opacity:0.5;margin-top:0.2rem;';legend.innerHTML='<span data-i18n="heatmapLegend">'+(L.heatmapLegend||'Less \u2192 More')+'</span> ';colors.forEach(function(c){legend.innerHTML+='<span style="display:inline-block;width:10px;height:10px;background:'+c+';border-radius:2px;margin:0 1px;vertical-align:middle;"></span>';});container.innerHTML='<div style="font-size:0.95rem;font-weight:700;" data-i18n="heatmapTitle">'+L.heatmapTitle+'</div>';container.appendChild(canvas);container.appendChild(stats);container.appendChild(legend);container.style.position='relative';container.appendChild(tooltip);}

document.addEventListener('DOMContentLoaded',function(){try{initPeerMode();}catch(e){console.warn('Peer init:',e);}try{initActivityHeatmap();}catch(e){console.warn('Heatmap init:',e);}});


/* === LAYOUT CLEANUP === */
(function(){
 /* Hide dynamically-created panels: wrap them in <details> so they collapse */
 document.addEventListener('DOMContentLoaded',function(){
 setTimeout(function(){
 /* Panels to collapse (id -> label) */
 var panels = {
 'dailyChallenge': '\uD83D\uDCC5 Daily Challenge',
 'peerModePanel': '\uD83D\uDC65 Peer Mode',
 'activityHeatmap': '\uD83D\uDFE9 Activity Heatmap',
 'labRecorderPanel': '\uD83D\uDCD3 Lab & Recorder',
 'sonifyPanel': '\uD83D\uDD0A Sonification',
 'explorerPanel': '\uD83D\uDD0D Parameter Explorer',
 'spacedPanel': '\uD83D\uDCC5 Spaced Repetition'
 };
 Object.keys(panels).forEach(function(id){
 var el = document.getElementById(id);
 if(!el || el.parentElement.tagName === 'DETAILS') return;
 var det = document.createElement('details');
 det.className = 'collapsible tool-panel';
 det.style.cssText = 'margin:6px 0;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0;overflow:hidden';
 var sum = document.createElement('summary');
 sum.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:13px;font-weight:600;list-style:none;background:rgba(0,0,0,0.2);color:inherit';
 sum.textContent = panels[id];
 det.appendChild(sum);
 el.parentNode.insertBefore(det, el);
 el.style.display = '';
 el.style.padding = '8px 12px';
 det.appendChild(el);
 });
 /* Also wrap the compare button area */
 var cmpBtn = document.querySelector('.compare-toggle,.compare-btn,[onclick*="compare"],[id*="compare"]');
 if(cmpBtn && cmpBtn.parentElement.tagName !== 'DETAILS'){
 cmpBtn.style.fontSize = '12px';
 }
 /* Clean up: move floating buttons to a tools bar if many exist */
 var floats = document.querySelectorAll('[style*="position:fixed"][style*="bottom"]');
 if(floats.length > 2){
 var bar = document.createElement('div');
 bar.style.cssText = 'position:fixed;bottom:10px;right:10px;display:flex;gap:6px;z-index:9990;flex-direction:column;align-items:flex-end';
 bar.id = 'toolsFloat';
 floats.forEach(function(f){
 if(f.id === 'mentorOverlay' || f.id === 'tooltipFloat' || f.id === 'voiceIndicator' || f.id === 'particleCanvas') return;
 f.style.position = 'relative';
 f.style.bottom = 'auto';
 f.style.right = 'auto';
 f.style.margin = '0';
 bar.appendChild(f);
 });
 if(bar.children.length > 0) document.body.appendChild(bar);
 }
 }, 500);
 });
})();
