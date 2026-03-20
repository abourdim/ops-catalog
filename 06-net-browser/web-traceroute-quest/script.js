/**
 * Traceroute Quest — Global Hop Map
 * Workshop DIY — Net Browser Collection
 * Visual traceroute across the globe with animated world map
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG (injected once) ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="77.139885 78.322945 253.991455 136.254120"> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797zM208.415588,151.261307L201.927002,151.261307L201.927002,154.5056L208.415588,154.5056L208.415588,151.261307zM195.438385,167.485199L192.194092,167.485199L192.194092,151.263702L195.438385,151.263702L195.438385,167.485199zM214.904205,167.485199L211.659897,167.485199L211.659897,151.263702L214.904205,151.263702L214.904205,167.485199zM201.927002,173.973801L198.682693,173.973801L198.682693,164.240906L205.171295,164.240906L205.171295,160.996597L201.927002,160.996597L201.927002,157.752304L208.415588,157.752304L208.415588,167.485199L201.927002,167.485199L201.927002,173.973801z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M173.301086,159.585083C173.612106,158.491119,173.874039,158.032059,174.626434,157.262268C175.395889,156.475021,176.401733,155.870239,176.941635,155.870239C177.36203,155.870239,177.647339,155.263535,177.647339,154.369537C177.647339,153.240067,178.097351,153.01268,180.332611,153.01268C181.328247,153.01268,182.282974,153.064713,182.454239,153.128311C182.730774,153.231003,182.765625,154.070618,182.765625,160.629913C182.765625,166.947327,182.723099,168.050049,182.471725,168.251938C182.069794,168.574738,178.407364,168.435822,177.965607,168.081009C177.75119,167.908813,177.647324,167.518738,177.647324,166.885712L177.647324,165.94603L176.584106,165.490997C175.198334,164.897919,174.243912,164.070435,173.733398,163.019424C173.265182,162.055481,173.060654,160.43071,173.301086,159.585083z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.601929,182.059692C154.740814,179.364502,156.707062,177.959259,159.536469,177.818451C160.701721,177.760437,161.251312,177.831604,162.144165,178.156082C163.450592,178.630859,165.150406,180.036514,165.749542,181.137527L166.150391,181.874146L171.23761,181.874146C175.554565,181.874146,176.349976,181.830872,176.490891,181.588379C176.673401,181.274307,177.547806,179.367874,178.631622,176.921021C179.274582,175.469437,179.523499,174.921753,180.081848,173.730072L180.595093,172.634674L182.95993,172.634674C184.912933,172.634674,185.324768,172.683594,185.324768,172.915649C185.324768,173.07019,185.049423,173.777435,184.712891,174.487305C184.376358,175.197189,183.943024,176.163757,183.749908,176.635269C183.556793,177.106766,183.115692,178.092621,182.769699,178.826065C182.423691,179.559509,182.025787,180.416779,181.885452,180.73111C181.745102,181.045441,181.453796,181.6884,181.238083,182.159897C181.022369,182.631409,180.643311,183.488678,180.395737,184.064957C179.824722,185.394073,179.204605,186.048218,178.254486,186.3237C177.765457,186.465485,175.502716,186.541504,171.771988,186.541504L166.040741,186.541504L165.659912,187.255905C165.138397,188.234222,163.85675,189.437042,162.748398,189.988312C161.961212,190.379837,161.551163,190.446259,159.943237,190.442749C158.273651,190.439087,157.93721,190.378052,156.97731,189.904602C155.279343,189.067123,154.253754,187.938721,153.568604,186.154144C153.151855,185.06868,153.167999,183.086639,153.601929,182.059692z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.70961,134.681961C154.933441,131.8022,158.021027,130.114639,160.98288,130.70665C163.119888,131.133804,164.512604,132.063324,165.540604,133.74852L166.13118,134.71666L172.036896,134.724625C179.724121,134.734985,179.189514,134.531769,180.806213,138.05806C181.046387,138.58194,181.506516,139.56781,181.828705,140.248856C182.150894,140.929916,182.572266,141.873413,182.765106,142.34552C182.957932,142.817627,183.418945,143.846344,183.789566,144.631577C184.160187,145.416794,184.582855,146.359299,184.72879,146.726013C184.874741,147.092743,185.068542,147.474228,185.159454,147.573761C185.250381,147.673309,185.324768,147.911697,185.324768,148.103516C185.324768,148.42543,185.139572,148.448166,182.920441,148.398804C180.143387,148.337021,180.601318,148.697861,179.105072,145.392487C178.607056,144.292328,177.979095,142.920685,177.709595,142.344406C177.440109,141.768127,177.087021,140.996597,176.924942,140.629868C176.762878,140.263153,176.561615,139.834503,176.477676,139.677338C176.349091,139.436539,175.522827,139.383606,171.225388,139.340881L166.125702,139.290192L165.734726,140.000244C165.222015,140.931427,163.772217,142.287949,162.807831,142.738846C160.99057,143.588516,158.677109,143.612717,156.992996,142.799698C155.47348,142.066116,154.281479,140.67366,153.456284,138.668228C153.079697,137.753036,153.198425,135.884811,153.70961,134.681961z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M142.359467,157.940231C142.509399,157.475464,142.773041,156.807739,142.945313,156.45639C143.301086,155.73085,144.960602,154.086121,145.719666,153.706772C147.453094,152.840485,150.120728,152.779083,151.897141,153.564621C153.038162,154.069183,154.633179,155.561859,155.143616,156.602798L155.49057,157.310364L162.396606,157.310364L169.302643,157.310364L169.245392,159.621033L169.188141,161.931702L162.336823,161.983459L155.485474,162.035233L154.951477,162.917023C154.333344,163.937775,152.845825,165.267944,151.815979,165.720886C151.320953,165.938599,150.48027,166.037445,149.070404,166.043716C147.337799,166.051422,146.909668,165.986923,146.165497,165.606079C144.226196,164.613617,142.876617,163.016098,142.361877,161.103683C141.998642,159.754135,141.998108,159.060349,142.359467,157.940231z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789734,195.730286L203.964523,195.730286L203.964523,199.334839L330.789734,199.334839L330.789734,195.730286z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789551,203.350861L161.68924,203.350861L161.68924,206.955414L330.789551,206.955414L330.789551,203.350861z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M199.007599,92.751289L211.076767,107.812828L202.108658,108.433113L193.221268,96.996552L191.912918,99.119194L192.604614,109.090935L185.184021,109.604782L183.137482,80.08474L190.55806,79.571373L191.466415,92.675797L200.002396,78.91729L208.593674,78.322945L199.007599,92.751289z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M234.138016,81.615562C236.040375,81.751511,237.914093,82.153725,239.704468,82.81044C242.302017,83.709618,244.733612,85.0299,246.901871,86.718407L245.150757,93.244476L244.516693,93.074516L244.196808,92.630768C242.70787,90.69416,240.767151,89.152077,238.543442,88.138672C237.43634,87.647743,236.259094,87.333046,235.05455,87.206039C234.227158,87.13401,233.394257,87.239655,232.611099,87.515953C232.1866,87.685104,231.808258,87.952736,231.507553,88.296593C230.788803,89.172775,230.813843,90.439911,231.566635,91.287064C232.032272,91.758965,232.559708,92.165504,233.134735,92.49572C233.880844,92.934601,234.641342,93.348839,235.414795,93.73764L236.692566,94.414246C238.063751,95.136879,239.357956,95.996429,240.555618,96.979881C241.421173,97.700912,242.148926,98.572769,242.70343,99.552994C243.199982,100.455551,243.47139,101.464417,243.494675,102.49408C243.516479,104.315857,243.04805,106.109734,242.138275,107.688644C241.268204,109.142014,239.979233,110.299194,238.440216,111.008636C236.697495,111.816132,234.786774,112.195747,232.867447,112.115822C231.006363,112.044464,229.16304,111.7258,227.386139,111.168236C225.295883,110.581566,223.299759,109.70047,221.458069,108.551567C220.391022,107.90168,219.366867,107.183914,218.391983,106.402733L220.215729,99.607994L220.868774,99.782715L221.294846,100.371597C223.248032,102.98111,225.940598,104.943588,229.023956,106.004974C230.198563,106.381287,231.426422,106.56295,232.65976,106.542908C233.398315,106.50238,234.108765,106.246048,234.70285,105.805771C235.495346,105.106613,235.762222,103.987152,235.3703,103.006096C234.953918,102.254745,234.346375,101.627075,233.608734,101.186172C232.310593,100.437439,230.990005,99.728287,229.648743,99.059662L228.913788,98.6465C227.703781,97.972984,226.583435,97.149826,225.579315,96.196541C224.730804,95.402397,224.063187,94.435135,223.621811,93.360443C223.239136,92.341805,223.078842,91.253273,223.151657,90.167679C223.224899,88.937332,223.518707,87.730194,224.019104,86.603645C224.773438,84.973534,226.068161,83.653664,227.684143,82.867416C229.688202,81.891472,231.914063,81.459724,234.138016,81.615562z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M158.184418,89.408417L158.63797,89.460617C160.159576,89.664032,161.581177,90.331436,162.709152,91.371941C163.457062,92.134872,164.054443,93.031792,164.469971,94.015739C164.905151,94.958809,165.210938,95.956268,165.379028,96.981071C165.586273,98.309639,165.448776,99.669395,164.979736,100.929688C164.526001,102.206253,163.843109,103.389481,162.9646,104.421295L177.202927,111.835213L168.925079,115.537735L156.954742,109.003616L154.522186,110.091713L158.959137,119.99498L152.206207,123.015327L140.106628,96.007126L150.980728,91.143959C152.423172,90.469635,153.929443,89.940933,155.477051,89.56575C156.366608,89.378746,157.27916,89.325714,158.184418,89.408417zM154.518402,95.879517C153.797302,95.981628,153.094345,96.184746,152.429993,96.482941C151.30661,96.954544,150.192154,97.445801,149.086243,97.956879L152.344727,105.230492C153.226166,104.854858,154.099228,104.460068,154.963409,104.046356C155.701569,103.707794,156.398712,103.2864,157.041443,102.79026C157.931732,102.040565,158.426819,100.923943,158.384399,99.761368C158.265366,98.633255,157.799194,97.57048,157.049652,96.718483C156.493423,96.132034,155.708206,95.817314,154.900574,95.857086L154.518402,95.879517z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M272.812744,97.204483L266.643219,106.109734L274.967194,111.866898L281.13623,102.961639L287.252136,107.192093L270.397125,131.522263L264.281219,127.291809L271.751953,116.507477L263.428467,110.75032L255.957245,121.534653L249.841339,117.304688L266.69635,92.974518L272.812744,97.204483z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M123.532295,113.696442L124.230148,113.777771C126.158524,114.073517,128.005737,114.761353,129.657501,115.798744C132.481201,117.587387,134.876709,119.973488,136.675644,122.789276C137.85083,124.63147,138.576599,126.723907,138.794327,128.897644C139.033569,131.465439,138.466858,134.044128,137.172913,136.275513C135.587463,138.969635,133.343018,141.21608,130.649414,142.80484C127.777443,144.458344,124.36438,144.902039,121.164574,144.037842C119.23671,143.51442,117.427086,142.626587,115.833755,141.422424C113.593025,139.763062,111.674324,137.709213,110.171577,135.361511C108.996712,133.520187,108.266281,131.430969,108.038124,129.259201C107.781654,126.690132,108.338432,124.10524,109.629959,121.869064C111.213356,119.173782,113.45533,116.925095,116.146744,115.332764C118.378197,114.032959,120.960136,113.460907,123.532295,113.696442zM120.237076,120.379318L119.887573,120.406281C118.354965,120.610733,116.961685,121.401001,116.000389,122.611092C115.056374,123.703064,114.59684,125.132736,114.727959,126.569733C114.794571,127.523895,115.040863,128.456757,115.453972,129.31958C116.053543,130.618454,116.854576,131.814713,117.827431,132.864029C118.900902,134.079971,120.115646,135.163635,121.446014,136.092072C122.648727,136.917191,124.021584,137.461685,125.463211,137.685394C127.280067,137.943146,129.110855,137.312714,130.383087,135.991302C131.89679,134.496063,132.46991,132.291229,131.875671,130.248962C131.491013,128.764099,130.784729,127.381737,129.806686,126.199554C128.542725,124.617355,127.058746,123.224152,125.399681,122.062111C124.287796,121.300659,123.037567,120.763733,121.719482,120.481628C121.230911,120.390747,120.733513,120.356422,120.237076,120.379318z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M301.601013,126.300751L302.299225,126.387955C304.863129,126.784752,307.239716,127.969833,309.098511,129.778381C311.170715,131.775146,312.75058,134.224945,313.714081,136.935547C314.870911,140.295837,314.546234,143.989166,312.820984,147.096512C311.958069,148.639557,310.845917,150.029465,309.529388,151.210129C307.452698,153.100769,305.048676,154.597107,302.434753,155.626007C300.399414,156.423401,298.204712,156.731628,296.028259,156.525696C293.460388,156.265411,291.037109,155.212799,289.095093,153.514084C286.754761,151.440582,284.981323,148.806931,283.940704,145.859634C282.870056,142.725098,283.092163,139.293045,284.557861,136.322372C285.44342,134.53299,286.664185,132.92984,288.153931,131.599777C290.215515,129.722946,292.602142,128.237671,295.197113,127.216599C297.231812,126.41954,299.424255,126.105988,301.601013,126.300751zM301.796417,133.319016L301.395599,133.345963C299.740631,133.540878,298.142822,134.070938,296.699768,134.903717C295.098816,135.78006,293.62146,136.865036,292.306549,138.130219C291.264404,139.150299,290.465088,140.391296,289.96759,141.761612C289.36438,143.493225,289.630615,145.409592,290.682953,146.911621C291.859528,148.684113,293.91449,149.671082,296.034698,149.48201C297.567047,149.390991,299.06073,148.964966,300.410278,148.234055C302.207336,147.299255,303.861511,146.112946,305.322906,144.710876C306.284607,143.767151,307.052765,142.644867,307.584167,141.407135C308.377655,139.487228,308.077698,137.288376,306.798889,135.650696C305.90625,134.37352,304.502838,133.544434,302.952667,133.378418C302.570068,133.321472,302.182861,133.301575,301.796417,133.319016z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.52771,174.938004C330.907135,176.376419,331.109863,177.855667,331.131348,179.343048C331.140991,180.913391,330.788269,182.464722,330.100525,183.876755C329.284912,185.402817,327.990417,186.61911,326.415833,187.338638C324.171936,188.395706,321.654877,188.72998,319.212524,188.295227C317.964203,188.048447,316.787842,187.521973,315.772491,186.755524C314.332245,185.751999,313.161652,184.409088,312.364532,182.845856C311.819153,181.800247,311.407227,180.69043,311.138458,179.542328L310.207031,175.759995L300.801575,178.072845L299.023926,170.85611L327.780579,163.784363L330.52771,174.938004zM315.575714,174.43985L315.699463,174.941345C315.911407,175.872101,316.160706,176.794067,316.446716,177.704803C316.734985,178.68222,317.291321,179.559418,318.052795,180.237213C318.620514,180.667114,319.293762,180.936279,320.001617,181.016113C321.123322,181.060883,322.237854,180.828857,323.248352,180.340271C324.14624,179.851425,324.777618,178.986908,324.96933,177.983337C325.126617,177.021484,325.083862,176.037781,324.843781,175.09317C324.644379,174.164948,324.426147,173.241089,324.189056,172.321732L315.575714,174.43985z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M116.693192,163.543213L113.851212,171.179825L95.025467,169.25325L110.58651,179.953522L107.74453,187.590118L77.373581,184.299744L80.062973,177.072876L100.10704,180.173035L83.216843,168.597382L85.788689,161.686646L106.05442,164.191376L88.928635,153.248993L91.548454,146.207825L116.693192,163.543213z"/> </svg>`;

const FOOTER_ICON = 'data:image/png;base64,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';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); const osc2 = audioCtx.createOscillator(); const gain2 = audioCtx.createGain(); osc2.connect(gain2); gain2.connect(audioCtx.destination); gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine'; gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4); osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {
    title: 'Traceroute Quest', subtitle: '🌍 Visual traceroute across the globe',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Global Hop Map', mainDesc: 'Trace the route packets take across the world',
    sectionA: 'How Traceroute Works', sectionB: 'Famous Internet Routes',
    sectionC: 'Route Statistics',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Enter a destination hostname or click Random.',
    howto_2: 'Click Trace Route to start the animated traceroute.',
    howto_3: 'Watch packets hop across the world map with latency info.',
    howto_4: 'Open Section C for route statistics and analysis.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 built-in themes including dark and light Islamic themes.',
    wiki_i18n_title: '🌐 Languages', wiki_i18n: 'Trilingual: English, Francais, Arabic with RTL support.',
    wiki_log_title: '📜 Activity Log', wiki_log: 'Timestamped, color-coded log of all traceroute operations.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'Local-first. All data stays in your browser.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🌍 Traceroute Quest ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    export: 'Export', filterAll: 'All',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', splashHint: 'tap to skip',
    newVersion: 'UPDATE', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    destPlaceholder: 'e.g. tokyo.example.jp',
    traceBtn: 'Trace Route', randomBtn: 'Random',
    hopListTitle: 'Hop Details', hopHost: 'Host', hopIP: 'IP', hopCity: 'City', hopLatency: 'ms',
    tracing: 'Tracing route to', hopReached: 'Hop', ttlExceeded: 'TTL exceeded at',
    traceComplete: 'Trace complete!', totalHops: 'Total hops', totalLatency: 'Total latency',
    tracerouteExplain: 'Traceroute sends packets with increasing TTL (Time To Live) values. Each router along the path decrements the TTL by 1. When TTL reaches 0, the router sends back an ICMP Time Exceeded message, revealing its identity. By incrementing TTL from 1, we discover each hop on the route to the destination.',
    routesText: 'Internet traffic follows submarine cables and terrestrial fiber routes. A packet from Algiers to Tokyo might cross the Mediterranean, traverse Europe, pass through the Suez region, cross the Indian Ocean via undersea cables, and arrive in Japan through multiple peering points.',
    statsText: 'Analyze the traced route for total latency, average hop time, longest hop, and geographical distance covered.',
    statsBtn: 'Calculate Stats', noTraceYet: 'Run a trace first!',
    avgLatency: 'Average latency', longestHop: 'Longest hop', shortestHop: 'Shortest hop',
    packetSent: 'Packet sent with TTL', destinationReached: 'Destination reached!',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Web Firewall Fortress and Web Botnet Defense! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'Traceroute Quest', subtitle: '🌍 Traceroute visuel autour du globe',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Carte des sauts', mainDesc: 'Tracez le chemin des paquets a travers le monde',
    sectionA: 'Comment fonctionne Traceroute', sectionB: 'Routes Internet celebres',
    sectionC: 'Statistiques de route',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Theme',
    settings: '⚙️ Parametres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Entre un nom d\'hote ou clique sur Aleatoire.',
    howto_2: 'Clique sur Tracer pour lancer le traceroute anime.',
    howto_3: 'Regarde les paquets sauter sur la carte du monde.',
    howto_4: 'Ouvre la Section C pour les statistiques de route.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 themes integres dont des themes islamiques.',
    wiki_i18n_title: '🌐 Langues', wiki_i18n: 'Trilingue : English, Francais, Arabe avec RTL.',
    wiki_log_title: '📜 Journal', wiki_log: 'Journal horodate des operations traceroute.',
    wiki_privacy_title: '🔒 Confidentialite', wiki_privacy: 'Local-first. Donnees dans le navigateur.',
    working: 'En cours…',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🌍 Traceroute Quest pret !',
    logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    export: 'Exporter', filterAll: 'Tout',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Reactif musique', splashHint: 'appuyer pour passer',
    newVersion: 'MAJ', langChanged: '🌐 Langue → Francais', themeChanged: '🎨 Theme →',
    destPlaceholder: 'ex: tokyo.example.jp',
    traceBtn: 'Tracer', randomBtn: 'Aleatoire',
    hopListTitle: 'Details des sauts', hopHost: 'Hote', hopIP: 'IP', hopCity: 'Ville', hopLatency: 'ms',
    tracing: 'Tracage de la route vers', hopReached: 'Saut', ttlExceeded: 'TTL expire a',
    traceComplete: 'Trace termine !', totalHops: 'Total sauts', totalLatency: 'Latence totale',
    tracerouteExplain: 'Traceroute envoie des paquets avec des valeurs TTL croissantes. Chaque routeur decremente le TTL de 1. Quand le TTL atteint 0, le routeur renvoie un message ICMP Time Exceeded, revelant son identite.',
    routesText: 'Le trafic Internet suit des cables sous-marins et des routes fibre terrestres. Un paquet d\'Alger a Tokyo pourrait traverser la Mediterranee, l\'Europe, la region de Suez, et arriver au Japon.',
    statsText: 'Analysez la route tracee pour la latence totale, le temps moyen par saut, le saut le plus long et la distance geographique.',
    statsBtn: 'Calculer les stats', noTraceYet: 'Lancez un trace d\'abord !',
    avgLatency: 'Latence moyenne', longestHop: 'Plus long saut', shortestHop: 'Plus court saut',
    packetSent: 'Paquet envoye avec TTL', destinationReached: 'Destination atteinte !',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Firewall Fortress and Web Botnet Defense ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar: {
    title: 'رحلة التتبع', subtitle: '🌍 تتبع بصري للمسار عبر العالم',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'خريطة القفزات', mainDesc: 'تتبع مسار الحزم عبر العالم',
    sectionA: 'كيف يعمل Traceroute', sectionB: 'مسارات الإنترنت الشهيرة',
    sectionC: 'إحصائيات المسار',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1: 'أدخل اسم مضيف أو انقر عشوائي.',
    howto_2: 'انقر تتبع المسار لبدء التتبع المتحرك.',
    howto_3: 'شاهد الحزم تقفز على خريطة العالم مع معلومات التأخير.',
    howto_4: 'افتح القسم C للإحصائيات وتحليل المسار.',
    wiki_themes_title: '🎨 المظاهر', wiki_themes: '8 مظاهر مدمجة بما فيها مظاهر إسلامية.',
    wiki_i18n_title: '🌐 اللغات', wiki_i18n: 'ثلاثي اللغات: إنجليزي، فرنسي، عربي مع RTL.',
    wiki_log_title: '📜 سجل النشاط', wiki_log: 'سجل مؤرّخ لعمليات التتبع.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'محلي أولاً. البيانات في متصفحك.',
    working: 'جارٍ…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '🌍 رحلة التتبع جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    export: 'تصدير', filterAll: 'الكل',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', splashHint: 'انقر للتخطي',
    newVersion: 'تحديث', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    destPlaceholder: 'مثال: tokyo.example.jp',
    traceBtn: 'تتبع المسار', randomBtn: 'عشوائي',
    hopListTitle: 'تفاصيل القفزات', hopHost: 'المضيف', hopIP: 'IP', hopCity: 'المدينة', hopLatency: 'تأخير',
    tracing: 'تتبع المسار إلى', hopReached: 'قفزة', ttlExceeded: 'TTL انتهى عند',
    traceComplete: 'اكتمل التتبع!', totalHops: 'إجمالي القفزات', totalLatency: 'إجمالي التأخير',
    tracerouteExplain: 'يرسل Traceroute حزماً بقيم TTL متزايدة. كل موجه يُنقص TTL بـ 1. عندما يصل TTL إلى 0، يرسل الموجه رسالة ICMP Time Exceeded كاشفاً هويته.',
    routesText: 'يتبع حركة الإنترنت الكابلات البحرية والألياف الأرضية. حزمة من الجزائر إلى طوكيو قد تعبر المتوسط وأوروبا والمحيط الهندي.',
    statsText: 'حلل المسار المتتبع للتأخير الكلي ومتوسط وقت القفزة والمسافة الجغرافية.',
    statsBtn: 'حساب الإحصائيات', noTraceYet: 'قم بتتبع أولاً!',
    avgLatency: 'متوسط التأخير', longestHop: 'أطول قفزة', shortestHop: 'أقصر قفزة',
    packetSent: 'حزمة أرسلت مع TTL', destinationReached: 'تم الوصول للهدف!',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Firewall Fortress and Web Botnet Defense! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang]; const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;
let typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, fullText); }
  else { d.textContent = fullText; logContainer.appendChild(d); }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); }
  logWithHistory(msg, type); applyLogFilter(); resetPetSleep();
}

function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }

/* ═══════ TOAST ═══════ */

let toastTimer = null;
function showToast(msg, autoHideMs = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }

/* ═══════ STATUS ═══════ */

function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

/* ═══════ SPLASH ═══════ */

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { if (activeLogFilter === 'all') { line.style.display = ''; return; } line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none'; }); }

/* ═══════ EXPORT LOG ═══════ */

function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const lines = Array.from(logContainer.children).map(d => d.textContent); const blob = new Blob([lines.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `traceroute-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url); log(LANG[currentLang].copied, 'success'); }

/* ═══════ HELPERS ═══════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function typewriterAppend(el, text) { el.classList.add('typing'); el.textContent = ''; for (let i = 0; i < text.length; i++) { el.textContent += text[i]; if (el.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight; await sleep(12 + Math.random() * 18); } el.classList.remove('typing'); }

const logHistory = [];
function logWithHistory(msg, type) { logHistory.push({ msg, type, ts: Date.now() }); }
function pulseBismillah(type) { const b = document.querySelector('.bismillah'); if (!b) return; b.classList.remove('pulse-success','pulse-error'); void b.offsetWidth; b.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success'); setTimeout(() => b.classList.remove('pulse-success','pulse-error'), 700); }

/* ═══════ THEME MELODIES ═══════ */

const THEME_MELODIES = { 'mosque-gold':[330,392,523], 'zellige':[440,523,659], 'andalus':[294,370,440], 'space':[523,659,784], 'jungle':[262,330,392], 'robot':[440,554,659], 'riad':[349,440,523], 'medina':[294,349,440], 'retro':[523,262,523] };
function playThemeMelody(name) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((freq, i) => { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }

/* ═══════ PIXEL PET ═══════ */

const PET_STATES = { idle: { class: 'pet-idle', duration: 0 }, happy: { class: 'pet-happy', duration: 3000 }, sad: { class: 'pet-sad', duration: 3000 }, sleep: { class: 'pet-sleep', duration: 0 } };
let petState = 'idle', petIdleTimer = null, petSleepTimer = null;
function initPixelPet() { const pet = document.createElement('div'); pet.id = 'pixelPet'; pet.className = 'pixel-pet pet-idle'; pet.title = 'Click me!'; pet.innerHTML = `<img src="${FOOTER_ICON}" alt="Bot" />`; pet.addEventListener('click', () => { setPetState('happy'); playSound('success'); }); const footer = document.querySelector('.app-footer'); if (footer) footer.insertBefore(pet, footer.firstChild); }
function setPetState(state) { petState = state; const pet = $('pixelPet'); if (!pet) return; pet.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep'); pet.classList.add(PET_STATES[state].class); if (petIdleTimer) clearTimeout(petIdleTimer); const dur = PET_STATES[state].duration; if (dur > 0) petIdleTimer = setTimeout(() => setPetState('idle'), dur); }
function resetPetSleep() { if (petSleepTimer) clearTimeout(petSleepTimer); if (petState === 'sleep') setPetState('idle'); petSleepTimer = setTimeout(() => setPetState('sleep'), 60000); }

/* ═══════ HIJRI DATE ═══════ */

function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {} }

/* ═══════ BREATHING + DHIKR ═══════ */

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { const bands = document.querySelectorAll('.deco-band'); breathingActive = !breathingActive; if (breathingActive) { bands.forEach(b => b.classList.add('breathing')); log('🫁 Breathing guide on', 'info'); } else { bands.forEach(b => b.classList.remove('breathing')); if (dhikrCount > 0) log(`📿 Dhikr: ${dhikrCount}`, 'success'); dhikrCount = 0; log('🫁 Breathing guide off', 'info'); } }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

/* ═══════ WHISPER MODE ═══════ */

let recognition = null, whisperActive = false;
function toggleWhisper() { if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('🎤 Speech not supported', 'error'); return; } if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('🎤 Whisper off', 'info'); return; } const SR = window.SpeechRecognition || window.webkitSpeechRecognition; recognition = new SR(); recognition.continuous = true; recognition.interimResults = false; recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US'; recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) { const t = e.results[i][0].transcript.trim(); if (t) log(`🎤 ${t}`, 'rx'); } } }; recognition.onerror = e => log(`🎤 Error: ${e.error}`, 'error'); recognition.onend = () => { if (whisperActive) recognition.start(); }; recognition.start(); whisperActive = true; log('🎤 Whisper on', 'success'); }

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); if (sb) { const f = sb.querySelector(FOCUSABLE); if (f) f.focus(); } }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
function openHelp() { openPanel('helpPanel','helpOverlay'); }
function closeHelp() { closePanel('helpPanel','helpOverlay','helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel','settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel','settingsOverlay','settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); const btn = $('logBtn'); if (btn) btn.focus(); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'); const contents = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const n = tab.dataset.tab; const tid = 'help' + n.charAt(0).toUpperCase() + n.slice(1); const target = $(tid); if (target) target.classList.add('active'); }); }); }

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() { const handle = $('logResizeHandle'), panel = $('logPanel'); if (!handle || !panel) return; let dragging = false, startX, startW; const isRtl = () => document.documentElement.dir === 'rtl'; handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); const nw = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)); document.documentElement.style.setProperty('--log-width', nw + 'px'); }); document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }); try { const saved = localStorage.getItem('wdiy-log-width'); if (saved) document.documentElement.style.setProperty('--log-width', saved); } catch {} }

/* ═══════ KONAMI ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE — RETRO MODE!', 'success'); } } else konamiIdx = 0; }); }

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix() { const canvas = $('matrixCanvas'); if (!canvas) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; } matrixRunning = true; canvas.classList.add('active'); const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight; const cols = Math.floor(canvas.width / 16); const drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri, serif'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }
function initMatrixTrigger() { const logo = $('logoWrap'); if (!logo) return; logo.style.cursor = 'pointer'; let cc = 0, ct = null; logo.addEventListener('click', () => { cc++; if (ct) clearTimeout(ct); if (cc >= 3) { cc = 0; toggleMatrix(); } else ct = setTimeout(() => cc = 0, 500); }); }

/* ══════════════════════════════════════════════════════════════
   TRACEROUTE SIMULATION ENGINE
   ══════════════════════════════════════════════════════════════ */

const CITIES = [
  { name: 'Algiers', lat: 36.75, lng: 3.06, ip: '41.221.20.' },
  { name: 'Marseille', lat: 43.30, lng: 5.37, ip: '80.12.45.' },
  { name: 'Paris', lat: 48.86, lng: 2.35, ip: '62.210.16.' },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68, ip: '195.219.14.' },
  { name: 'London', lat: 51.51, lng: -0.13, ip: '185.100.85.' },
  { name: 'Amsterdam', lat: 52.37, lng: 4.90, ip: '93.158.134.' },
  { name: 'New York', lat: 40.71, lng: -74.01, ip: '208.67.222.' },
  { name: 'Chicago', lat: 41.88, lng: -87.63, ip: '162.252.71.' },
  { name: 'Los Angeles', lat: 34.05, lng: -118.24, ip: '172.217.14.' },
  { name: 'Tokyo', lat: 35.68, lng: 139.69, ip: '210.171.226.' },
  { name: 'Singapore', lat: 1.35, lng: 103.82, ip: '103.31.196.' },
  { name: 'Dubai', lat: 25.20, lng: 55.27, ip: '94.200.77.' },
  { name: 'Mumbai', lat: 19.08, lng: 72.88, ip: '49.44.100.' },
  { name: 'Sydney', lat: -33.87, lng: 151.21, ip: '203.5.76.' },
  { name: 'Sao Paulo', lat: -23.55, lng: -46.63, ip: '200.160.2.' },
  { name: 'Cairo', lat: 30.04, lng: 31.24, ip: '197.53.10.' },
  { name: 'Moscow', lat: 55.76, lng: 37.62, ip: '95.108.213.' },
  { name: 'Istanbul', lat: 41.01, lng: 28.98, ip: '88.255.216.' },
  { name: 'Johannesburg', lat: -26.20, lng: 28.04, ip: '41.0.4.' },
  { name: 'Toronto', lat: 43.65, lng: -79.38, ip: '142.4.97.' },
];

const DESTINATIONS = [
  'tokyo.example.jp', 'london.server.uk', 'newyork.cloud.us',
  'sydney.node.au', 'dubai.gateway.ae', 'paris.cdn.fr',
  'singapore.hub.sg', 'saopaulo.srv.br', 'mumbai.edge.in',
  'moscow.host.ru', 'istanbul.net.tr', 'johannesburg.za.net'
];

let currentHops = [];
let traceRunning = false;
let packetAnimProgress = -1;
let animFrame = null;

function latLngToCanvas(lat, lng, w, h) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

function generateRoute(destName) {
  const origin = CITIES[0]; // Algiers
  // Find destination city based on name
  let destCity = CITIES.find(c => destName.toLowerCase().includes(c.name.toLowerCase()));
  if (!destCity) destCity = CITIES[Math.floor(Math.random() * (CITIES.length - 1)) + 1];

  // Build route with 8-12 hops
  const hopCount = 8 + Math.floor(Math.random() * 5);
  const route = [origin];
  const used = new Set([0]);

  // Add intermediate cities
  for (let i = 1; i < hopCount - 1; i++) {
    const available = CITIES.filter((_, idx) => !used.has(idx) && CITIES[idx] !== destCity);
    if (available.length === 0) break;
    const next = available[Math.floor(Math.random() * available.length)];
    const idx = CITIES.indexOf(next);
    used.add(idx);
    route.push(next);
  }
  route.push(destCity);

  // Generate hop data with latencies
  const hops = route.map((city, i) => {
    const baseLat = i === 0 ? 1 : (5 + Math.random() * 40);
    const jitter = Math.random() * 10 - 5;
    return {
      hop: i + 1,
      host: i === 0 ? 'gateway.local' : `router-${i}.${city.name.toLowerCase()}.net`,
      ip: city.ip + Math.floor(Math.random() * 255),
      city: city.name,
      lat: city.lat,
      lng: city.lng,
      latency: Math.round(baseLat + jitter + i * 3),
    };
  });
  return hops;
}

/* ═══════ WORLD MAP DRAWING ═══════ */

function drawWorldMap(ctx, w, h) {
  // Dark background
  ctx.fillStyle = '#0a1628';
  ctx.fillRect(0, 0, w, h);

  // Simplified continent outlines (polygons)
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 0.5;
  for (let lat = -60; lat <= 80; lat += 30) {
    const y = ((90 - lat) / 180) * h;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * w;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  // Simplified continents as filled regions
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;

  // Africa
  drawContinent(ctx, w, h, [[-5,37],[10,36],[12,32],[33,30],[42,12],[50,-2],[40,-12],[35,-25],[28,-34],[18,-35],[12,-18],[8,-5],[-17,5],[-15,15],[-8,25],[-5,37]]);
  // Europe
  drawContinent(ctx, w, h, [[-10,40],[0,44],[5,48],[10,48],[15,55],[25,60],[30,70],[40,65],[42,55],[30,45],[25,37],[15,38],[5,43],[-5,44],[-10,40]]);
  // Asia
  drawContinent(ctx, w, h, [[40,65],[50,55],[60,50],[70,40],[80,30],[90,25],[100,15],[110,10],[120,22],[130,35],[140,45],[145,50],[150,60],[170,65],[180,68],[140,75],[100,75],[60,72],[40,65]]);
  // North America
  drawContinent(ctx, w, h, [[-170,65],[-140,62],[-130,55],[-125,48],[-120,35],[-115,30],[-105,25],[-90,20],[-85,25],[-80,30],[-75,40],[-70,45],[-65,48],[-55,50],[-60,60],[-70,70],[-100,72],[-140,70],[-170,65]]);
  // South America
  drawContinent(ctx, w, h, [[-80,10],[-75,5],[-60,5],[-50,0],[-45,-5],[-40,-15],[-40,-22],[-45,-25],[-50,-30],[-55,-35],[-60,-40],[-65,-50],[-70,-55],[-75,-45],[-70,-20],[-75,-10],[-78,0],[-80,10]]);
  // Australia
  drawContinent(ctx, w, h, [[115,-15],[125,-14],[135,-12],[145,-15],[150,-23],[152,-28],[148,-35],[140,-38],[130,-33],[115,-35],[114,-25],[115,-15]]);

  // City dots
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  CITIES.forEach(city => {
    const p = latLngToCanvas(city.lat, city.lng, w, h);
    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
  });
}

function drawContinent(ctx, w, h, points) {
  ctx.beginPath();
  points.forEach((p, i) => {
    const cp = latLngToCanvas(p[1], p[0], w, h);
    if (i === 0) ctx.moveTo(cp.x, cp.y);
    else ctx.lineTo(cp.x, cp.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawRoute(ctx, w, h, hops, currentHopIdx) {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const accent2 = getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim() || '#0ea5e9';

  // Draw lines between hops
  for (let i = 0; i < Math.min(currentHopIdx, hops.length - 1); i++) {
    const p1 = latLngToCanvas(hops[i].lat, hops[i].lng, w, h);
    const p2 = latLngToCanvas(hops[i + 1].lat, hops[i + 1].lng, w, h);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    // Curved line
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2 - 20;
    ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Draw hop points
  for (let i = 0; i <= Math.min(currentHopIdx, hops.length - 1); i++) {
    const p = latLngToCanvas(hops[i].lat, hops[i].lng, w, h);
    const isActive = (i === currentHopIdx);

    // Glow
    if (isActive) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1;
    }

    // Dot
    ctx.beginPath(); ctx.arc(p.x, p.y, isActive ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? '#22c55e' : (i === hops.length - 1 && i <= currentHopIdx) ? '#ef4444' : accent;
    ctx.fill();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '10px Tajawal, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText(hops[i].city, p.x + 8, p.y - 5);
    ctx.fillStyle = accent2;
    ctx.font = '9px monospace';
    ctx.fillText(`${hops[i].latency}ms`, p.x + 8, p.y + 7);
    ctx.globalAlpha = 1;
  }

  // Animated packet
  if (packetAnimProgress >= 0 && currentHopIdx < hops.length - 1) {
    const p1 = latLngToCanvas(hops[currentHopIdx].lat, hops[currentHopIdx].lng, w, h);
    const p2 = latLngToCanvas(hops[currentHopIdx + 1].lat, hops[currentHopIdx + 1].lng, w, h);
    const t = packetAnimProgress;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2 - 20;
    // Quadratic bezier interpolation
    const px = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
    const py = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;

    // Packet glow
    ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fillStyle = accent2; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  }
}

function renderMap() {
  const canvas = $('mapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  drawWorldMap(ctx, w, h);
  if (currentHops.length > 0) {
    drawRoute(ctx, w, h, currentHops, traceRunning ? traceCurrentHop : currentHops.length);
  }
}

let traceCurrentHop = 0;

async function runTrace() {
  if (traceRunning) return;
  const s = LANG[currentLang];
  const dest = $('destInput').value.trim() || DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
  $('destInput').value = dest;

  traceRunning = true;
  traceCurrentHop = 0;
  packetAnimProgress = -1;
  setStatus(true);
  showToast(s.tracing + ' ' + dest);
  log(`${s.tracing} ${dest}`, 'tx');

  currentHops = generateRoute(dest);
  const hopBody = $('hopBody');
  hopBody.innerHTML = '';
  $('hopList').style.display = 'block';

  for (let i = 0; i < currentHops.length; i++) {
    traceCurrentHop = i;
    const hop = currentHops[i];

    // Animate packet travel
    packetAnimProgress = 0;
    const animSteps = 30;
    for (let step = 0; step <= animSteps; step++) {
      packetAnimProgress = step / animSteps;
      renderMap();
      await sleep(25);
    }
    packetAnimProgress = -1;

    // Add hop to table
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border)';
    tr.style.opacity = '0';
    tr.innerHTML = `<td style="padding:.3rem;">${hop.hop}</td><td style="padding:.3rem;font-size:.75rem;">${hop.host}</td><td style="padding:.3rem;font-family:monospace;font-size:.75rem;">${hop.ip}</td><td style="padding:.3rem;">${hop.city}</td><td style="padding:.3rem;text-align:right;color:${hop.latency > 100 ? '#fca5a5' : hop.latency > 50 ? '#fbbf24' : '#86efac'};">${hop.latency}</td>`;
    hopBody.appendChild(tr);
    requestAnimationFrame(() => tr.style.opacity = '1');
    tr.style.transition = 'opacity 0.3s';

    log(`${s.hopReached} ${hop.hop}: ${hop.city} (${hop.ip}) — ${hop.latency}ms`, i === currentHops.length - 1 ? 'success' : 'info');
    playSound('click');
    await sleep(300 + Math.random() * 400);
  }

  renderMap();
  traceRunning = false;
  hideToast();
  log(`${s.traceComplete} ${s.totalHops}: ${currentHops.length}, ${s.totalLatency}: ${currentHops.reduce((a, h) => a + h.latency, 0)}ms`, 'success');
}

function randomDest() {
  $('destInput').value = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
  playSound('click');
}

function calculateStats() {
  const s = LANG[currentLang];
  const results = $('statsResults');
  if (!results) return;
  if (currentHops.length === 0) { results.style.display = 'block'; results.innerHTML = `<p style="color:var(--text-muted);">${s.noTraceYet}</p>`; return; }

  const latencies = currentHops.map(h => h.latency);
  const total = latencies.reduce((a, b) => a + b, 0);
  const avg = (total / latencies.length).toFixed(1);
  const max = Math.max(...latencies);
  const min = Math.min(...latencies);
  const maxHop = currentHops.find(h => h.latency === max);
  const minHop = currentHops.find(h => h.latency === min);

  results.style.display = 'block';
  results.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.5rem;">
      <div style="padding:.5rem;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);">
        <div style="font-size:.7rem;color:var(--text-muted);">${s.totalHops}</div>
        <div style="font-size:1.2rem;font-weight:700;color:var(--accent);">${currentHops.length}</div>
      </div>
      <div style="padding:.5rem;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);">
        <div style="font-size:.7rem;color:var(--text-muted);">${s.totalLatency}</div>
        <div style="font-size:1.2rem;font-weight:700;color:var(--accent);">${total}ms</div>
      </div>
      <div style="padding:.5rem;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);">
        <div style="font-size:.7rem;color:var(--text-muted);">${s.avgLatency}</div>
        <div style="font-size:1.2rem;font-weight:700;color:var(--accent);">${avg}ms</div>
      </div>
      <div style="padding:.5rem;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);">
        <div style="font-size:.7rem;color:var(--text-muted);">${s.longestHop}</div>
        <div style="font-size:1rem;font-weight:700;color:#fca5a5;">${maxHop.city} (${max}ms)</div>
      </div>
    </div>`;
  log(`📊 Stats: ${currentHops.length} hops, ${total}ms total, ${avg}ms avg`, 'success');
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  // Settings
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;

  // Log panel
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }

  // Whisper, breathing, dhikr
  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = toggleWhisper;
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = () => log('🎵 Music mode coming soon', 'info');

  // Keys
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  // Lang + Theme
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  // Restore prefs
  try { const sl = localStorage.getItem('wdiy-lang'); const st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}

  // Easter eggs
  initKonami();
  initMatrixTrigger();
  initHijriDate();
  initPixelPet();

  // App-specific: Traceroute
  const traceBtn = $('traceBtn'); if (traceBtn) traceBtn.onclick = runTrace;
  const randomBtnEl = $('randomBtn'); if (randomBtnEl) randomBtnEl.onclick = randomDest;
  const statsBtn = $('statsBtn'); if (statsBtn) statsBtn.onclick = calculateStats;

  // Initial map render
  renderMap();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
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
